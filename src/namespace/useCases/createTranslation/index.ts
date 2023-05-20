import { NamespaceModel } from '../../model';
import { NamespaceRepo } from '../../namespaceRepo';
import { CreateTranslationController } from './createTranslationController';
import { CreateTranslationUseCase } from './createTranslationUseCase';

const namespaceRepo = new NamespaceRepo(NamespaceModel);
const createTranslationUseCase = new CreateTranslationUseCase(namespaceRepo);
export const createTranslationController = new CreateTranslationController(
  createTranslationUseCase,
);
