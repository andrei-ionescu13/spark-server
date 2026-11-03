import { Mongo } from '../../../../../mongo';
import { LanguageQueriesRepo } from '../../repo/queries';
import { SearchLanguagesController } from './searchLanguagesController';
import { SearchLanguagesUseCase } from './searchLanguagesUseCase';

const languageQueriesRepo = new LanguageQueriesRepo(Mongo.getCollection('languages'));
const searchLanguagesUseCase = new SearchLanguagesUseCase(languageQueriesRepo);
export const searchLanguagesController = new SearchLanguagesController(searchLanguagesUseCase);
