import { ProductModel } from '../../../../../product/model';
import { ProductRepo } from '../../../../../product/productRepo';
import { OperatingSystemModel } from '../../model';
import { OperatingSystemCommandsRepo } from '../../repo/commands';
import { OperatingSystemQueriesRepo } from '../../repo/queries';
import { DeleteOperatingSystemBulkController } from './deleteOperatingSystemBulkController';
import { DeleteOperatingSystemBulkUseCase } from './deleteOperatingSystemrBulkUseCase';

const productRepo = new ProductRepo(ProductModel);
const operatingSystemCommandsRepo = new OperatingSystemCommandsRepo(OperatingSystemModel);
const operatingSystemQueriesRepo = new OperatingSystemQueriesRepo(OperatingSystemModel);

const deleteOperatingSystemBulkUseCase = new DeleteOperatingSystemBulkUseCase(
  productRepo,
  operatingSystemCommandsRepo,
  operatingSystemQueriesRepo,
);

export const deleteOperatingSystemBulkController = new DeleteOperatingSystemBulkController(
  deleteOperatingSystemBulkUseCase,
);
