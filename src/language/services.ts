import { languageDb } from './index';
import { namespaceDb } from '../namespace/index';
import { ForbiddenError } from '../errors';

const createLanguage = async (props) => {
  const exists = await languageDb.getLanguageByCode(props.code);

  if (exists) {
    throw new ForbiddenError('language already exists');
  }

  const language = await languageDb.createLanguage(props);
  return language;
};

const deleteLanguage = async (id, shouldDeleteTranslations) => {
  const language = await languageDb.getLanguage(id);

  if (!language) {
    throw new NotFoundError('language not found');
  }

  if (shouldDeleteTranslations) {
    await namespaceDb.deleteTranslations(language.code);
  }

  await languageDb.deleteLanguage(id);
};

const listLanguages = () => languageDb.listLanguages();

export const languageServices = {
  createLanguage,
  deleteLanguage,
  listLanguages,
};
