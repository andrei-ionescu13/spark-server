import { NamespaceModel } from '../../model';
import { NamespaceRepo } from '../../namespaceRepo';
import { UpdateTranslationController } from './updateTranslationController';
import { UpdateTranslationUseCase } from './updateTranslationUseCase';

const namespaceRepo = new NamespaceRepo(NamespaceModel);
const updateTranslationUseCase = new UpdateTranslationUseCase(namespaceRepo);
export const updateTranslationController = new UpdateTranslationController(
  updateTranslationUseCase,
);
