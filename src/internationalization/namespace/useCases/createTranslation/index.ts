import { NamespaceModel } from '../../model';
import { NamespaceCommandsRepo } from '../../repo/commands';
import { CreateTranslationController } from './createTranslationController';
import { CreateTranslationUseCase } from './createTranslationUseCase';

const namespaceCommandsRepo = new NamespaceCommandsRepo(NamespaceModel);
const createTranslationUseCase = new CreateTranslationUseCase(namespaceCommandsRepo);
export const createTranslationController = new CreateTranslationController(
  createTranslationUseCase,
);
