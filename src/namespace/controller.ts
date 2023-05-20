import { namespaceServices } from './index';
import fs from 'fs';
import { languageServices } from '../language/services';

export const namespaceController = {
  getNamespace: async (req, res, next) => {
    try {
      const { id } = req.params;
      const namespace = await namespaceServices.getNamespace(id);
      res.json(namespace);
    } catch (error) {
      next(error);
    }
  },

  createNamespace: async (req, res, next) => {
    const props = req.body;

    try {
      const namespace = await namespaceServices.createNamespace(props);
      res.json(namespace);
    } catch (error) {
      next(error);
    }
  },

  deleteNamespace: async (req, res, next) => {
    const { id } = req.params;

    try {
      await namespaceServices.deleteNamespace(id);
      res.json({ ok: 'ok' });
    } catch (error) {
      next(error);
    }
  },

  listNamespaces: async (req, res, next) => {
    try {
      const namespaces = await namespaceServices.listNamespaces();
      res.json(namespaces);
    } catch (error) {
      next(error);
    }
  },

  addNamespaceTranslation: async (req, res, next) => {
    const { id } = req.params;
    const props = req.body;

    try {
      const namespace = await namespaceServices.addNamespaceTranslation(id, props);
      res.json(namespace);
    } catch (error) {
      next(error);
    }
  },

  updateNamespaceName: async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const namespace = await namespaceServices.updateNamespace(id, { name });
      res.json(namespace);
    } catch (error) {
      next(error);
    }
  },

  deleteNamespaceTranslation: async (req, res, next) => {
    const { id, key: translationKey } = req.params;
    try {
      await namespaceServices.deleteNamespaceTranslation(id, translationKey);
      res.json({ ok: 'ok' });
    } catch (error) {
      next(error);
    }
  },

  updateNamespaceTranslation: async (req, res, next) => {
    const { id, key: translationKey } = req.params;
    const props = req.body;

    try {
      await namespaceServices.updateNamespaceTranslation(id, translationKey, props);
      res.json({ ok: 'ok' });
    } catch (error) {
      next(error);
    }
  },

  // searchNamespaces: async (req, res, next) => {
  //   let { searchFor = 'namespaces', language: languageCodes } = req.query;

  //   if (!languageCodes) {
  //     const languages = await languageServices.listLanguages();
  //     languageCodes = languages.map((language) => language.code);
  //   } else {
  //     languageCodes = languageCodes.split(',');
  //   }

  //   const promise =
  //     searchFor === 'translations'
  //       ? namespaceServices.searchTranslations(req.query, languageCodes)
  //       : namespaceServices.searchNamespaces(req.query, languageCodes);

  //   try {
  //     const result = await promise;
  //     res.json(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  searchNamespaceTranslations: async (req, res, next) => {
    const { id } = req.params;
    let { language: languageCodes } = req.query;

    if (!languageCodes) {
      const languages = await languageServices.listLanguages();
      languageCodes = languages.map((language) => language.code);
    } else {
      languageCodes = languageCodes.split(',');
    }

    try {
      const result = await namespaceServices.searchNamespaceTranslations(
        id,
        req.query,
        languageCodes,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  exportNamespaces: async (req, res, next) => {
    try {
      const { directoryPath, filePath } = await namespaceServices.exportNamespaces();

      res.download(filePath, 'translations', function (err) {
        fs.rmSync(directoryPath, { recursive: true, force: true });
        fs.unlinkSync(filePath);
      });
    } catch (error) {
      next(error);
    }
  },
};
