import { LanguageModel } from '../../model';
import { LanguageCommandsRepo } from '../../repo/commands';
import { LanguageQueriesRepo } from '../../repo/queries';
import { DeleteLanguageController } from './deleteLanguageController';
import { DeleteLanguageUseCase } from './deleteLanguageUseCase';

const languageCommandsRepo = new LanguageCommandsRepo(LanguageModel);
const languageQueriesRepo = new LanguageQueriesRepo(LanguageModel);

const deleteLanguageUseCase = new DeleteLanguageUseCase(languageCommandsRepo, languageQueriesRepo);

export const deleteLanguageController = new DeleteLanguageController(deleteLanguageUseCase);
