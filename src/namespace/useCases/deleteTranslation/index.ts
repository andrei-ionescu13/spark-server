import { NamespaceModel } from '../../model';
import { NamespaceRepo } from '../../namespaceRepo';
import { DeleteTranslationController } from './deleteTranslationController';
import { DeleteTranslationUseCase } from './deleteTranslationUseCase';

const namespaceRepo = new NamespaceRepo(NamespaceModel);
const deleteTranslationUseCase = new DeleteTranslationUseCase(namespaceRepo);
export const deleteTranslationController = new DeleteTranslationController(
  deleteTranslationUseCase,
);
