import { Mongo } from '../../../../../mongo';
import { TranslationService } from '../../../../../services/translationService';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { LanguageQueriesRepo } from '../../../language/repo/queries';
import { NamespaceQueriesRepo } from '../../repo/queries';
import { UploadNamespacesController } from './uploadNamespacesController';
import { UploadNamespacesUseCase } from './uploadNamespacesUseCase';

const namespaceQueriesRepo = new NamespaceQueriesRepo(Mongo.getCollection('namespaces'));
const languageQueriesRepo = new LanguageQueriesRepo(Mongo.getCollection('languages'));

const translationService = new TranslationService();
const uploaderService = new CloudinaryUploaderService();

const uploadNamespacesUseCase = new UploadNamespacesUseCase(
  namespaceQueriesRepo,
  languageQueriesRepo,
  translationService,
  uploaderService,
);
export const uploadNamespacesController = new UploadNamespacesController(uploadNamespacesUseCase);
