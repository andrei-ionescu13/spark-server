import { Mongo } from '../../../../../mongo';
import { OperatingSystemCommandsRepo } from '../../repo/commands';
import { OperatingSystemQueriesRepo } from '../../repo/queries';
import { CreateOperatingSystemController } from './createOperatingSystemController';
import { CreateOperatingSystemUseCase } from './createOperatingSystemUseCase';

const operatingSystemCommandsRepo = new OperatingSystemCommandsRepo(
  Mongo.getCollection('operating_systems'),
);
const operatingSystemQueriesRepo = new OperatingSystemQueriesRepo(
  Mongo.getCollection('operating_systems'),
);

const createOperatingSystemUseCase = new CreateOperatingSystemUseCase(
  operatingSystemCommandsRepo,
  operatingSystemQueriesRepo,
);

export const createOperatingSystemController = new CreateOperatingSystemController(
  createOperatingSystemUseCase,
);
