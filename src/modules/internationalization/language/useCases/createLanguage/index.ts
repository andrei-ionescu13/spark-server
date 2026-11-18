import { Mongo } from '../../../../../mongo';
import { LanguageCommandsRepo } from '../../repo/commands';
import { CreateLanguageController } from './createLanguageController';
import { CreateLanguageUseCase } from './createLanguageUseCase';

const languageCommandsRepo = new LanguageCommandsRepo();
const createLanguageUseCase = new CreateLanguageUseCase(languageCommandsRepo);
export const createLanguageController = new CreateLanguageController(createLanguageUseCase);
