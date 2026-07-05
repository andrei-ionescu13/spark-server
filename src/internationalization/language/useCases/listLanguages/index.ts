import { LanguageModel } from '../../model';
import { LanguageQueriesRepo } from '../../repo/queries';
import { ListLanguagesController } from './listLanguagesController';
import { ListLanguagesUseCase } from './listLanguagesUseCase';

const languageQueriesRepo = new LanguageQueriesRepo(LanguageModel);
const listLanguagesUseCase = new ListLanguagesUseCase(languageQueriesRepo);
export const listLanguagesController = new ListLanguagesController(listLanguagesUseCase);
