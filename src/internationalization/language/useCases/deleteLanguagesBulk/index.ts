import { LanguageModel } from '../../model';
import { LanguageCommandsRepo } from '../../repo/commands';
import { LanguageQueriesRepo } from '../../repo/queries';
import { DeleteLanguagesBulkController } from './deleteLanguagesBulkController';
import { DeleteLanguagesBulkUseCase } from './deleteLanguagesBulkUseCase';

const languageCommandsRepo = new LanguageCommandsRepo(LanguageModel);
const languageQueriesRepo = new LanguageQueriesRepo(LanguageModel);

const deleteLanguagesBulkUseCase = new DeleteLanguagesBulkUseCase(
  languageCommandsRepo,
  languageQueriesRepo,
);
export const deleteLanguagesBulkController = new DeleteLanguagesBulkController(
  deleteLanguagesBulkUseCase,
);
