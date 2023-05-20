import Joi from 'joi';
import { platformDb, platformServices } from './index';
import { ValidationError } from '../errors';
import { uploader } from '../services/uploaderService';

const schema = Joi.object({
  name: Joi.string().required(),
  logo: Joi.any().required(),
});

export const platformController = {
  createPlatform: async (req, res, next) => {
    const params = req.body;

    const { error } = schema.validate({
      ...params,
      logo: req.file,
    });

    if (error) {
      next(new ValidationError(error.message));
      return;
    }

    const platform = await platformServices.createPlatform(params, req.file);
    res.status(201).send({ platform });
  },

  searchPlatforms: async (req, res) => {
    const result = await platformServices.searchPlatforms(req.query);
    res.json(result);
  },

  listPlatforms: async (_, res) => {
    const platforms = await platformServices.listPlatforms();
    res.json(platforms);
  },

  deletePlatform: async (req, res) => {
    const { id } = req.params;
    await platformServices.deletePlatform(id);

    res.status(200).json({ ok: 'ok' });
  },

  deleteMultiplePlatforms: async (req, res) => {
    const { ids } = req.body;
    await Promise.all(ids.map((id) => platformServices.deletePlatform(id)));

    res.status(200).json({ ok: 'ok' });
  },

  updatePlatform: async (req, res, next) => {
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
      const updatedPlatform = await platformServices.updatePlatform(id, props, req.file);
      res.json({ platform: updatedPlatform });
    } catch (error) {
      next(error);
    }
  },
};
