import { Mongo } from '../../../../../mongo';
import { TranslationService } from '../../../../../services/translationService';
import { LanguageQueriesRepo } from '../../../language/repo/queries';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { ExportNamespacesController } from './exportNamespacesController';
import { ExportNamespacesUseCase } from './exportNamespacesUseCase';

const namespaceQueriesRep = new NamespaceQueriesRepo();
const languageQueriesRepo = new LanguageQueriesRepo();

const translationService = new TranslationService();

const exportNamespacesUseCase = new ExportNamespacesUseCase(
  namespaceQueriesRep,
  languageQueriesRepo,
  translationService,
);

export const exportNamespacesController = new ExportNamespacesController(exportNamespacesUseCase);
