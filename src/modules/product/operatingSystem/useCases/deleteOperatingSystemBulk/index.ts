import { Mongo } from '../../../../../mongo';
import { ProductCommandsRepo } from '../../../repo/commands';
import { OperatingSystemCommandsRepo } from '../../repo/commands';
import { OperatingSystemQueriesRepo } from '../../repo/queries';
import { DeleteOperatingSystemBulkController } from './deleteOperatingSystemBulkController';
import { DeleteOperatingSystemBulkUseCase } from './deleteOperatingSystemrBulkUseCase';

const productCommandsRepo = new ProductCommandsRepo();
const operatingSystemCommandsRepo = new OperatingSystemCommandsRepo();
const operatingSystemQueriesRepo = new OperatingSystemQueriesRepo();

const deleteOperatingSystemBulkUseCase = new DeleteOperatingSystemBulkUseCase(
  productCommandsRepo,
  operatingSystemCommandsRepo,
  operatingSystemQueriesRepo,
);

export const deleteOperatingSystemBulkController = new DeleteOperatingSystemBulkController(
  deleteOperatingSystemBulkUseCase,
);
