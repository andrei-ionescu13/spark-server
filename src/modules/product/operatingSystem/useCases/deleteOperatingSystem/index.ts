import { Mongo } from '../../../../../mongo';
import { ProductCommandsRepo } from '../../../repo/commands';
import { OperatingSystemCommandsRepo } from '../../repo/commands';
import { OperatingSystemQueriesRepo } from '../../repo/queries';
import { DeleteOperatingSystemController } from './deleteOperatingSystemController';
import { DeleteOperatingSystemUseCase } from './deleteOperatingSystemUseCase';

const productRepo = new ProductCommandsRepo(Mongo.getCollection('products'));
const operatingSystemCommandsRepo = new OperatingSystemCommandsRepo(
  Mongo.getCollection('operating_systems'),
);
const operatingSystemQueriesRepo = new OperatingSystemQueriesRepo(
  Mongo.getCollection('operating_systems'),
);

const deleteOperatingSystemUseCase = new DeleteOperatingSystemUseCase(
  productRepo,
  operatingSystemCommandsRepo,
  operatingSystemQueriesRepo,
);
export const deleteOperatingSystemController = new DeleteOperatingSystemController(
  deleteOperatingSystemUseCase,
);
