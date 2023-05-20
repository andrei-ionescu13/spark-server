import Joi from 'joi';
import { publisherDb, publisherServices } from './index';
import { ValidationError } from '../errors';
import { uploader } from '../services/uploaderService';

const schema = Joi.object({
  name: Joi.string().required(),
  logo: Joi.any().required(),
});

export const publisherController = {
  createPublisher: async (req, res, next) => {
    const params = req.body;

    const { error } = schema.validate({
      ...params,
      logo: req.file,
    });

    if (error) {
      next(new ValidationError(error.message));
      return;
    }

    const publisher = await publisherServices.createPublisher(params, req.file);
    res.status(201).send({ publisher });
  },

  searchPublishers: async (req, res) => {
    const result = await publisherServices.searchPublishers(req.query);
    res.json(result);
  },

  listPublishers: async (_, res) => {
    const publishers = await publisherServices.listPublishers();
    res.json(publishers);
  },

  deletePublisher: async (req, res) => {
    const { id } = req.params;
    await publisherServices.deletePublisher(id);

    res.status(200).json({ ok: 'ok' });
  },

  deleteMultiplePublishers: async (req, res) => {
    const { ids } = req.body;
    await Promise.all(ids.map((id) => publisherServices.deletePublisher(id)));

    res.status(200).json({ ok: 'ok' });
  },

  updatePublisher: async (req, res, next) => {
    const { id } = req.params;
    const props = req.body;

    const { error } = schema.validate({
      ...props,
      logo: props.logo || req.file,
    });

    if (error) {
      next(new ValidationError(error.message));
      return;
    }

    try {
      const updatedPublisher = await publisherServices.updatePublisher(id, props, req.file);
      res.json({ publisher: updatedPublisher });
    } catch (error) {
      next(error);
    }
  },
};
