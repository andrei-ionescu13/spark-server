import { ProductModel } from '../../../model';
import { ProductRepo } from '../../../productRepo';
import { OperatingSystemModel } from '../../model';
import { OperatingSystemCommandsRepo } from '../../repo/commands';
import { OperatingSystemQueriesRepo } from '../../repo/queries';
import { DeleteOperatingSystemController } from './deleteOperatingSystemController';
import { DeleteOperatingSystemUseCase } from './deleteOperatingSystemUseCase';

const productRepo = new ProductRepo(ProductModel);
const operatingSystemCommandsRepo = new OperatingSystemCommandsRepo(OperatingSystemModel);
const operatingSystemQueriesRepo = new OperatingSystemQueriesRepo(OperatingSystemModel);

const deleteOperatingSystemUseCase = new DeleteOperatingSystemUseCase(
  productRepo,
  operatingSystemCommandsRepo,
  operatingSystemQueriesRepo,
);
export const deleteOperatingSystemController = new DeleteOperatingSystemController(
  deleteOperatingSystemUseCase,
);
