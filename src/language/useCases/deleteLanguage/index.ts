import { LanguageRepo } from '../../languageRepo';
import { LanguageModel } from '../../model';
import { DeleteLanguageController } from './deleteLanguageController';
import { DeleteLanguageUseCase } from './deleteLanguageUseCase';

const languageRepo = new LanguageRepo(LanguageModel);
const deleteLanguageUseCase = new DeleteLanguageUseCase(languageRepo);
export const deleteLanguageController = new DeleteLanguageController(deleteLanguageUseCase);
