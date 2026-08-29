import { Mongo } from '../../../../../mongo';
import { NamespaceCommandsRepo } from '../../repo/commands';
import { UpdateTranslationController } from './updateTranslationController';
import { UpdateTranslationUseCase } from './updateTranslationUseCase';

const namespaceCommandsRepo = new NamespaceCommandsRepo(Mongo.getCollection('namespaces'));
const updateTranslationUseCase = new UpdateTranslationUseCase(namespaceCommandsRepo);
export const updateTranslationController = new UpdateTranslationController(
  updateTranslationUseCase,
);
