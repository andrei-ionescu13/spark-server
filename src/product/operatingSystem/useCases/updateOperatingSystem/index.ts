import { OperatingSystemModel } from '../../model';
import { OperatingSystemCommandsRepo } from '../../repo/commands';
import { OperatingSystemQueriesRepo } from '../../repo/queries';
import { UpdateOperatingSystemController } from './updateOperatingSystemController';
import { UpdateOperatingSystemUseCase } from './updateOperatingSystemUseCase';

const operatingSystemCommandsRepo = new OperatingSystemCommandsRepo(OperatingSystemModel);
const operatingSystemQueriesRepo = new OperatingSystemQueriesRepo(OperatingSystemModel);

const updateOperatingSystemUseCase = new UpdateOperatingSystemUseCase(
  operatingSystemCommandsRepo,
  operatingSystemQueriesRepo,
);

export const updateOperatingSystemController = new UpdateOperatingSystemController(
  updateOperatingSystemUseCase,
);
