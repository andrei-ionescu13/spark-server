import { Mongo } from '../../../../../mongo';
import { LanguageQueriesRepo } from '../../repo/queries';
import { ListLanguagesController } from './listLanguagesController';
import { ListLanguagesUseCase } from './listLanguagesUseCase';

const languageQueriesRepo = new LanguageQueriesRepo();
const listLanguagesUseCase = new ListLanguagesUseCase(languageQueriesRepo);
export const listLanguagesController = new ListLanguagesController(listLanguagesUseCase);
