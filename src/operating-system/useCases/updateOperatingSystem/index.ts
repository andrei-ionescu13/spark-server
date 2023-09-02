import { OperatingSystemRepo } from '../../operatingSystemRepo';
import { OperatingSystemModel } from '../../model';
import { UpdateOperatingSystemController } from './updateOperatingSystemController';
import { UpdateOperatingSystemUseCase } from './updateOperatingSystemUseCase';

const operatingSystemRepo = new OperatingSystemRepo(OperatingSystemModel);
const updateOperatingSystemUseCase = new UpdateOperatingSystemUseCase(operatingSystemRepo);
export const updateOperatingSystemController = new UpdateOperatingSystemController(
  updateOperatingSystemUseCase,
);
