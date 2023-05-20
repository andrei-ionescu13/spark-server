import { LanguageRepo } from '../../languageRepo';
import { LanguageModel } from '../../model';
import { ListLanguagesController } from './listLanguagesController';
import { ListLanguagesUseCase } from './listLanguagesUseCase';

const languageRepo = new LanguageRepo(LanguageModel);
const listLanguagesUseCase = new ListLanguagesUseCase(languageRepo);
export const listLanguagesController = new ListLanguagesController(listLanguagesUseCase);
