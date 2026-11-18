import { Mongo } from '../../../../../mongo';
import { ProductCommandsRepo } from '../../../repo/commands';
import { OperatingSystemCommandsRepo } from '../../repo/commands';
import { OperatingSystemQueriesRepo } from '../../repo/queries';
import { DeleteOperatingSystemController } from './deleteOperatingSystemController';
import { DeleteOperatingSystemUseCase } from './deleteOperatingSystemUseCase';

const productCommandsRepo = new ProductCommandsRepo();
const operatingSystemCommandsRepo = new OperatingSystemCommandsRepo();
const operatingSystemQueriesRepo = new OperatingSystemQueriesRepo();

const deleteOperatingSystemUseCase = new DeleteOperatingSystemUseCase(
  productCommandsRepo,
  operatingSystemCommandsRepo,
  operatingSystemQueriesRepo,
);
export const deleteOperatingSystemController = new DeleteOperatingSystemController(
  deleteOperatingSystemUseCase,
);
