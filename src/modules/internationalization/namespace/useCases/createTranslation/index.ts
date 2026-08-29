import { Mongo } from '../../../../../mongo';
import { NamespaceCommandsRepo } from '../../repo/commands';
import { CreateTranslationController } from './createTranslationController';
import { CreateTranslationUseCase } from './createTranslationUseCase';

const namespaceCommandsRepo = new NamespaceCommandsRepo(Mongo.getCollection('namespaces'));
const createTranslationUseCase = new CreateTranslationUseCase(namespaceCommandsRepo);
export const createTranslationController = new CreateTranslationController(
  createTranslationUseCase,
);
