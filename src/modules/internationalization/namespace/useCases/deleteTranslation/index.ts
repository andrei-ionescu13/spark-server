import { Mongo } from '../../../../../mongo';
import { NamespaceCommandsRepo } from '../../repo/commands';
import { DeleteTranslationController } from './deleteTranslationController';
import { DeleteTranslationUseCase } from './deleteTranslationUseCase';

const namespaceCommandsRepo = new NamespaceCommandsRepo();
const deleteTranslationUseCase = new DeleteTranslationUseCase(namespaceCommandsRepo);
export const deleteTranslationController = new DeleteTranslationController(
  deleteTranslationUseCase,
);
