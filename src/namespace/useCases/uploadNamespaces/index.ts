import { TranslationService } from "../../../services/translationService";
import { CloudinaryUploaderService } from "../../../services/uploaderService";
import { TranslationsLanguageRepo } from "../../../translations-language/languageRepo";
import { TranslationsLanguageModel } from "../../../translations-language/model";
import { NamespaceModel } from "../../model";
import { NamespaceRepo } from "../../namespaceRepo";
import { UploadNamespacesController } from "./uploadNamespacesController";
import { UploadNamespacesUseCase } from "./uploadNamespacesUseCase";

const namespaceRepo = new NamespaceRepo(NamespaceModel);
const translationsLanguageRepo = new TranslationsLanguageRepo(TranslationsLanguageModel);

const translationService = new TranslationService();
const uploaderService = new CloudinaryUploaderService();

const uploadNamespacesUseCase = new UploadNamespacesUseCase(
  namespaceRepo,
  translationsLanguageRepo,
  translationService,
  uploaderService
);
export const uploadNamespacesController = new UploadNamespacesController(uploadNamespacesUseCase);