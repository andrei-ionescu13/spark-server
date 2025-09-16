import { NamespaceModel } from '../../model';
import { NamespaceCommandsRepo } from '../../repo/commands';
import { DeleteTranslationController } from './deleteTranslationController';
import { DeleteTranslationUseCase } from './deleteTranslationUseCase';

const namespaceCommandsRepo = new NamespaceCommandsRepo(NamespaceModel);
const deleteTranslationUseCase = new DeleteTranslationUseCase(namespaceCommandsRepo);
export const deleteTranslationController = new DeleteTranslationController(
  deleteTranslationUseCase,
);
