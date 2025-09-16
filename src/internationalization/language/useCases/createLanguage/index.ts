import { LanguageModel } from '../../model';
import { LanguageCommandsRepo } from '../../repo/commands';
import { CreateLanguageController } from './createLanguageController';
import { CreateLanguageUseCase } from './createLanguageUseCase';

const languageCommandsRepo = new LanguageCommandsRepo(LanguageModel);
const createLanguageUseCase = new CreateLanguageUseCase(languageCommandsRepo);
export const createLanguageController = new CreateLanguageController(createLanguageUseCase);
