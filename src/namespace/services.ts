import { languageDb } from '../language/index';
import { namespaceDb as namespaceDb } from './index';
import { join } from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';

const getNamespace = async (id) => {
  const namespace = await namespaceDb.getNamespace(id);
  return namespace;
};

const createNamespace = async (props) => {
  const namespace = await namespaceDb.createNamespace(props);
  return namespace;
};

const deleteNamespace = async (id) => {
  const namespace = await namespaceDb.getNamespace(id);

  if (!namespace) {
    throw new NotFoundError('namespace not found');
  }

  await namespaceDb.deleteNamespace(id);
};

const listNamespaces = () => namespaceDb.listNamespaces();

const addNamespaceTranslation = (id, props) => {
  const namespace = namespaceDb.addNamespaceTranslation(id, props);
  return namespace;
};

const updateNamespace = async (id, props) => {
  const namespace = await namespaceDb.getNamespace(id);

  if (!namespace) {
    throw new NotFoundError('namespace not found');
  }

  const updatedNamespace = await namespaceDb.updateNamespace(id, props);
  return updatedNamespace;
};

const deleteNamespaceTranslation = async (id, translationKey) => {
  const namespace = await namespaceDb.getNamespace(id, { 'translations.key': translationKey });

  if (!namespace) {
    throw new NotFoundError('namespace not found');
  }

  await namespaceDb.deleteNamespaceTranslation(id, translationKey);
};

const updateNamespaceTranslation = async (id, translationKey, props) => {
  const namespace = await namespaceDb.getNamespace(id, { 'translations.key': translationKey });

  if (!namespace) {
    throw new NotFoundError('namespace not found');
  }

  await namespaceDb.updateNamespaceTranslation(id, translationKey, props);
};

const searchNamespaces = async (query, languageCodes) => {
  const namespaces = await namespaceDb.searchNamespaces(query, languageCodes);
  const count = await namespaceDb.getNamespacesCount(query, languageCodes);

  return {
    namespaces,
    count,
  };
};

const searchTranslations = async (query, languageCodes) => {
  const namespaces = await namespaceDb.searchTranslations(query, languageCodes);

  return namespaces;
};

const searchNamespaceTranslations = async (id, query, languageCodes) => {
  const namespace = await namespaceDb.searchNamespaceTranslations(id, query, languageCodes);
  return {
    count: 10,
    ...namespace[0],
  };
};

const exportNamespaces = async () => {
  const languages = await languageDb.listLanguages();
  const namespaces = await namespaceDb.listNamespaces();
  const languagesCodes = languages.map((language) => language.code);
  const rootDirectory = join(process.cwd(), 'public', Date.now().toString());

  fs.mkdirSync(rootDirectory);

  languagesCodes.forEach((code) => {
    fs.mkdirSync(join(rootDirectory, code));
    namespaces.forEach((namespace) => {
      const namespacesName = namespace.name;
      const mappedTranslations = {};

      namespace.translations.forEach((translation) => {
        mappedTranslations[translation.key] = translation?.[code] || '';
      });

      fs.writeFileSync(
        join(rootDirectory, code, `${namespacesName}.json`),
        JSON.stringify(mappedTranslations),
      );
    });
  });
  const zip = new AdmZip();
  const outputFile = `${Date.now().toString()}.zip`;
  await zip.addLocalFolderPromise(rootDirectory);
  await zip.writeZipPromise(join(process.cwd(), 'public', outputFile));

  return {
    directoryPath: rootDirectory,
    filePath: join(process.cwd(), 'public', outputFile),
  };
};

export const namespaceServices = {
  createNamespace,
  deleteNamespace,
  listNamespaces,
  addNamespaceTranslation,
  getNamespace,
  updateNamespace,
  deleteNamespaceTranslation,
  updateNamespaceTranslation,
  searchNamespaces,
  searchNamespaceTranslations,
  searchTranslations,
  exportNamespaces,
};
