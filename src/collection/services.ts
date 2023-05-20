import { collectionRepo } from './index';
import { ForbiddenError, NotFoundError } from '../errors';
import { uploader } from '../services/uploaderService';

const searchCollections = async (query) => {
  const collections = await collectionRepo.searchCollections(query);
  const count = await collectionRepo.getCollectionsCount(query);

  return {
    collections,
    count,
  };
};

const deleteCollection = async (id) => {
  const collection = await collectionRepo.getCollection(id);

  if (!collection) {
    res.status(404).send();
    return;
  }

  await collectionRepo.deleteCollection(id);
  await uploader.delete(collection.cover.public_id);

  return collection;
};

const deactivateCollection = async (id) => {
  const collection = await collectionRepo.getCollection(id);

  if (!collection) {
    throw new NotFoundError('collection not found');
  }

  await collectionRepo.updateCollection(id, { endDate: Date.now() });
  return collection;
};

const updateCollection = async (id, props, coverFile) => {
  let { cover, ...propsRest } = props;

  const collection = await collectionRepo.getCollection(id);

  if (!collection) {
    throw new NotFoundError('collection not found');
  }

  if (coverFile) {
    await uploader.delete(collection.cover.public_id);
    const uploadedCover = await uploader.uploadFile(coverFile);
    propsRest.cover = uploadedCover;
  }

  propsRest.endDate = !!propsRest.endDate ? propsRest.endDate : null;
  const updatedCollection = await collectionRepo.updateCollection(id, propsRest);
  return updatedCollection;
};

export const collectionServices = {
  searchCollections,
  deleteCollection,
  deactivateCollection,
  updateCollection,
};
