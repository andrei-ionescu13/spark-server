import { Mongo } from '../../../../../mongo';
import { LanguageCommandsRepo } from '../../repo/commands';
import { LanguageQueriesRepo } from '../../repo/queries';
import { DeleteLanguagesBulkController } from './deleteLanguagesBulkController';
import { DeleteLanguagesBulkUseCase } from './deleteLanguagesBulkUseCase';

const languageCommandsRepo = new LanguageCommandsRepo(Mongo.getCollection('languages'));
const languageQueriesRepo = new LanguageQueriesRepo(Mongo.getCollection('languages'));

const deleteLanguagesBulkUseCase = new DeleteLanguagesBulkUseCase(
  languageCommandsRepo,
  languageQueriesRepo,
);
export const deleteLanguagesBulkController = new DeleteLanguagesBulkController(
  deleteLanguagesBulkUseCase,
);
