import { NamespaceModel } from '../../model';
import { NamespaceCommandsRepo } from '../../repo/commands';
import { UpdateTranslationController } from './updateTranslationController';
import { UpdateTranslationUseCase } from './updateTranslationUseCase';

const namespaceCommandsRepo = new NamespaceCommandsRepo(NamespaceModel);
const updateTranslationUseCase = new UpdateTranslationUseCase(namespaceCommandsRepo);
export const updateTranslationController = new UpdateTranslationController(
  updateTranslationUseCase,
);
