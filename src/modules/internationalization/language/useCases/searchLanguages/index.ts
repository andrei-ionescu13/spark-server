import { Mongo } from '../../../../../mongo';
import { LanguageQueriesRepo } from '../../repo/queries';
import { SearchLanguagesController } from './searchLanguagesController';
import { SearchLanguagesUseCase } from './searchLanguagesUseCase';

const languageQueriesRepo = new LanguageQueriesRepo();
const searchLanguagesUseCase = new SearchLanguagesUseCase(languageQueriesRepo);
export const searchLanguagesController = new SearchLanguagesController(searchLanguagesUseCase);
