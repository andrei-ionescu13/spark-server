import { OperatingSystemRepo } from '../../operatingSystemRepo';
import { OperatingSystemModel } from '../../model';
import { AddOperatingSystemController } from './addOperatingSystemController';
import { AddOperatingSystemUseCase } from './addOperatingSystemUseCase';

const operatingSystemRepo = new OperatingSystemRepo(OperatingSystemModel);
const addOperatingSystemUseCase = new AddOperatingSystemUseCase(operatingSystemRepo);
export const addOperatingSystemController = new AddOperatingSystemController(
  addOperatingSystemUseCase,
);
