import Joi from 'joi';
import { languageServices } from './index';
import { KeyModel } from '../key/index';
import { uploader } from '../services/uploaderService';
import { productValidation } from './validation';

export const languageController = {
  createLanguage: async (req, res, next) => {
    const props = req.body;

    try {
      const language = await languageServices.createLanguage(props);
      res.json(language);
    } catch (error) {
      next(error);
    }
  },

  deleteLanguage: async (req, res, next) => {
    const { id } = req.params;
    const { shouldDeleteTranslations } = req.body;

    try {
      await languageServices.deleteLanguage(id, shouldDeleteTranslations);
      res.json({ ok: 'ok' });
    } catch (error) {
      next(error);
    }
  },

  listLanguages: async (req, res, next) => {
    try {
      const languages = await languageServices.listLanguages();
      res.json(languages);
    } catch (error) {
      next(error);
    }
  },
};
