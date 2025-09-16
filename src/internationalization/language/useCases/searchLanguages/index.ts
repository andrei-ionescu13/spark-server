import { LanguageModel } from '../../model';
import { LanguageQueriesRepo } from '../../repo/queries';
import { SearchLanguagesController } from './searchLanguagesController';
import { SearchLanguagesUseCase } from './searchLanguagesUseCase';

const languageQueriesRepo = new LanguageQueriesRepo(LanguageModel);
const searchLanguagesUseCase = new SearchLanguagesUseCase(languageQueriesRepo);
export const searchLanguagesController = new SearchLanguagesController(searchLanguagesUseCase);
