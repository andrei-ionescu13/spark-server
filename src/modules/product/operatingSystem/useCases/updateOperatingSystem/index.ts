import { Mongo } from '../../../../../mongo';
import { OperatingSystemCommandsRepo } from '../../repo/commands';
import { OperatingSystemQueriesRepo } from '../../repo/queries';
import { UpdateOperatingSystemController } from './updateOperatingSystemController';
import { UpdateOperatingSystemUseCase } from './updateOperatingSystemUseCase';

const operatingSystemCommandsRepo = new OperatingSystemCommandsRepo();
const operatingSystemQueriesRepo = new OperatingSystemQueriesRepo();

const updateOperatingSystemUseCase = new UpdateOperatingSystemUseCase(
  operatingSystemCommandsRepo,
  operatingSystemQueriesRepo,
);

export const updateOperatingSystemController = new UpdateOperatingSystemController(
  updateOperatingSystemUseCase,
);
