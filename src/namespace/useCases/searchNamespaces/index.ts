import { LanguageRepo } from '../../../language/languageRepo';
import { LanguageModel } from '../../../language/model';
import { NamespaceModel } from '../../model';
import { NamespaceRepo } from '../../namespaceRepo';
import { SearchNamespacesController } from './searchNamespacesController';
import { SearchNamespacesUseCase } from './searchNamespacesUseCase';

const namespaceRepo = new NamespaceRepo(NamespaceModel);
const languageRepo = new LanguageRepo(LanguageModel);
const searchNamespacesUseCase = new SearchNamespacesUseCase(namespaceRepo, languageRepo);
export const searchNamespacesController = new SearchNamespacesController(searchNamespacesUseCase);
