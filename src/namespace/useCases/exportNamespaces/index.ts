import { LanguageRepo } from '../../../language/languageRepo';
import { LanguageModel } from '../../../language/model';
import { NamespaceModel } from '../../model';
import { NamespaceRepo } from '../../namespaceRepo';
import { ExportNamespacesController } from './exportNamespacesController';
import { ExportNamespacesUseCase } from './exportNamespacesUseCase';

const namespaceRepo = new NamespaceRepo(NamespaceModel);
const languageRepo = new LanguageRepo(LanguageModel);
const exportNamespacesUseCase = new ExportNamespacesUseCase(namespaceRepo, languageRepo);
export const exportNamespacesController = new ExportNamespacesController(exportNamespacesUseCase);
