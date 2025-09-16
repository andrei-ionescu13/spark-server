import { TranslationService } from '../../../../services/translationService';
import { LanguageModel } from '../../../language/model';
import { LanguageQueriesRepo } from '../../../language/repo/queries';
import { NamespaceModel } from '../../model';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { ExportNamespacesController } from './exportNamespacesController';
import { ExportNamespacesUseCase } from './exportNamespacesUseCase';

const namespaceQueriesRep = new NamespaceQueriesRepo(NamespaceModel);
const languageQueriesRepo = new LanguageQueriesRepo(LanguageModel);

const translationService = new TranslationService();

const exportNamespacesUseCase = new ExportNamespacesUseCase(
  namespaceQueriesRep,
  languageQueriesRepo,
  translationService,
);

export const exportNamespacesController = new ExportNamespacesController(exportNamespacesUseCase);
