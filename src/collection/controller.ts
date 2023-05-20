import Joi from 'joi';
import { collectionRepo } from './index';
import { collectionServices } from './index';
import { NotFoundError, ValidationError } from '../errors';
import { uploader } from '../services/uploaderService';

export const collectionController = {
  deactivateCollection: async (req, res, next) => {
    try {
      const { id } = req.params;
      const collection = await collectionServices.deactivateCollection(id);
      res.json(collection);
    } catch (error) {
      next(error);
    }
  },

  createCollection: async (req, res) => {
    const uploadedFile = await uploader.uploadFile(req.file);
    const params = req.body;
    params.cover = uploadedFile;
    params.endDate = !!params.endDate ? params.endDate : null;
    const collection = await collectionRepo.createCollection(params);
    res.status(201).json(collection);
  },

  // getCollection: async (req, res, next) => {
  //   try {
  //     const { id } = req.params;

  //     const collection = await collectionRepo.getCollection(id);
  //     res.json(collection);
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  deleteCollection: async (req, res) => {
    const { id } = req.params;
    const collection = await collectionServices.deleteCollection(id);

    res.json(collection);
  },

  deleteMultipleCollections: async (req, res) => {
    const { ids } = req.body;
    const collections = await collectionRepo.listCollections(ids);

    if (!collections) {
      res.status(404).send();
      return;
    }

    await Promise.all(
      collections.map((collection) => collectionServices.deleteCollection(collection._id)),
    );

    res.status(204).send();
  },

  searchCollections: async (req, res, next) => {
    try {
      const result = await collectionServices.searchCollections(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  updateCollection: async (req, res, next) => {
    const { id } = req.params;
    const props = req.body;

    try {
      const updatedProduct = await collectionServices.updateCollection(id, props, req.file);
      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },

  duplicateCollection: async (req, res) => {
    const { id } = req.params;
    const collection = await collectionRepo.duplicateCollection(id);
    res.status(201).json({ id: collection._id });
  },

  updateCollectionMeta: async (req, res, next) => {
    const { id } = req.params;
    const props = req.body;
    const { error } = updateCollectionMetaSchema.validate(props);

    if (error) {
      next(new ValidationError(error.message));
      return;
    }

    const collection = await collectionRepo.getCollection(id);

    if (collection.status === 'archived') {
      return res.status(400).send({ message: `can't update an archived collection` });
    }

    const updatedCollection = await collectionRepo.updateCollection(id, { meta: props });
    const { meta, updatedAt } = updatedCollection;

    res.send({ meta, updatedAt });
  },

  updateCollectionStatus: async (req, res, next) => {
    const { id } = req.params;
    const props = req.body;
    const collection = await collectionRepo.getCollection(id);

    if (collection.status === 'archived' && props.status === 'archived') {
      return res.status(400).send({ message: `can't update an archived collection` });
    }

    const updatedCollection = await collectionRepo.updateCollection(id, props);
    const { status } = updatedCollection;

    res.json({ status });
  },

  updateCollectionCategory: async (req, res, next) => {
    const { id } = req.params;
    const props = req.body;
    const collection = await collectionRepo.getCollection(id);

    if (collection.status === 'archived' && props.status === 'archived') {
      return res.status(400).send({ message: `can't update an archived collection` });
    }

    const updatedCollection = await collectionRepo.updateCollection(id, props);
    const { category } = updatedCollection;

    res.json({ category });
  },

  updateCollectionDetails: async (req, res, next) => {
    const { id } = req.params;
    const props = req.body;

    const { error } = updateCollectionDetailsSchema.validate({
      ...props,
      cover: props.cover || req.file,
    });

    if (error) {
      next(new ValidationError(error.message));
      return;
    }

    const collection = await collectionRepo.getCollection(id);

    if (!collection) {
      res.status(404).send();
      return;
    }

    if (collection.status === 'archived') {
      return res.status(400).send({ message: `can't update an archived collection` });
    }

    if (collection.cover === props.cover) {
      const updatedCollection = await collectionRepo.updateCollection(id, props);

      res.json({
        description: updatedCollection.description,
        title: updatedCollection.title,
        slug: updatedCollection.slug,
        markdown: updatedCollection.markdown,
        cover: updatedCollection.cover,
        updatedAt: updatedCollection.updatedAt,
      });
      return;
    }

    const fileUploaded = await uploader.upload(req.file);

    props.cover = fileUploaded.url;
    props.coverPublicId = fileUploaded.public_id;

    await uploader.delete(collection.coverPublicId);
    const updatedCollection = await collectionRepo.updateCollection(id, props);

    res.json({
      description: updatedCollection.description,
      title: updatedCollection.title,
      slug: updatedCollection.slug,
      markdown: updatedCollection.markdown,
      cover: updatedCollection.cover,
    });
  },
};
