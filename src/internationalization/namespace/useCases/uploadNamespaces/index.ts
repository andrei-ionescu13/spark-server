import { TranslationService } from '../../../../services/translationService';
import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { LanguageModel } from '../../../language/model';
import { LanguageQueriesRepo } from '../../../language/repo/queries';
import { NamespaceModel } from '../../model';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { UploadNamespacesController } from './uploadNamespacesController';
import { UploadNamespacesUseCase } from './uploadNamespacesUseCase';

const namespaceQueriesRepo = new NamespaceQueriesRepo(NamespaceModel);
const languageQueriesRepo = new LanguageQueriesRepo(LanguageModel);

const translationService = new TranslationService();
const uploaderService = new CloudinaryUploaderService();

const uploadNamespacesUseCase = new UploadNamespacesUseCase(
  namespaceQueriesRepo,
  languageQueriesRepo,
  translationService,
  uploaderService,
);
export const uploadNamespacesController = new UploadNamespacesController(uploadNamespacesUseCase);
