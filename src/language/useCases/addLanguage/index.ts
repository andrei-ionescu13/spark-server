import { LanguageRepo } from '../../languageRepo';
import { LanguageModel } from '../../model';
import { AddLanguageController } from './addLanguageController';
import { AddLanguageUseCase } from './addLanguageUseCase';

const languageRepo = new LanguageRepo(LanguageModel);
const addLanguageUseCase = new AddLanguageUseCase(languageRepo);
export const addLanguageController = new AddLanguageController(addLanguageUseCase);
