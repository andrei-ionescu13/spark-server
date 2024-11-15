import { TranslationService } from '../../../services/translationService';
import { TranslationsLanguageRepo } from '../../../translations-language/languageRepo';
import { TranslationsLanguageModel } from '../../../translations-language/model';
import { NamespaceModel } from '../../model';
import { NamespaceRepo } from '../../namespaceRepo';
import { ExportNamespacesController } from './exportNamespacesController';
import { ExportNamespacesUseCase } from './exportNamespacesUseCase';

const namespaceRepo = new NamespaceRepo(NamespaceModel);
const translationsLanguageRepo = new TranslationsLanguageRepo(TranslationsLanguageModel);

const translationService = new TranslationService();

const exportNamespacesUseCase = new ExportNamespacesUseCase(
  namespaceRepo,
  translationsLanguageRepo,
  translationService
);

export const exportNamespacesController = new ExportNamespacesController(exportNamespacesUseCase);
