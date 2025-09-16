import { OperatingSystemModel } from '../../model';
import { OperatingSystemCommandsRepo } from '../../repo/commands';
import { OperatingSystemQueriesRepo } from '../../repo/queries';
import { CreateOperatingSystemController } from './createOperatingSystemController';
import { CreateOperatingSystemUseCase } from './createOperatingSystemUseCase';

const operatingSystemCommandsRepo = new OperatingSystemCommandsRepo(OperatingSystemModel);
const operatingSystemQueriesRepo = new OperatingSystemQueriesRepo(OperatingSystemModel);

const createOperatingSystemUseCase = new CreateOperatingSystemUseCase(
  operatingSystemCommandsRepo,
  operatingSystemQueriesRepo,
);

export const createOperatingSystemController = new CreateOperatingSystemController(
  createOperatingSystemUseCase,
);
