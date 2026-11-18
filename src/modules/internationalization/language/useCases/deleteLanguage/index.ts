import { Mongo } from '../../../../../mongo';
import { LanguageCommandsRepo } from '../../repo/commands';
import { LanguageQueriesRepo } from '../../repo/queries';
import { DeleteLanguageController } from './deleteLanguageController';
import { DeleteLanguageUseCase } from './deleteLanguageUseCase';

const languageCommandsRepo = new LanguageCommandsRepo();
const languageQueriesRepo = new LanguageQueriesRepo();

const deleteLanguageUseCase = new DeleteLanguageUseCase(languageCommandsRepo, languageQueriesRepo);

export const deleteLanguageController = new DeleteLanguageController(deleteLanguageUseCase);
