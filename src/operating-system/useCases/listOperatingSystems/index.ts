import { OperatingSystemRepo } from '../../operatingSystemRepo';
import { OperatingSystemModel } from '../../model';
import { ListOperatingSystemsController } from './listOperatingSystemsController';
import { ListOperatingSystemsUseCase } from './listOperatingSystemsUseCase';

const operatingSystemRepo = new OperatingSystemRepo(OperatingSystemModel);
const listOperatingSystemsUseCase = new ListOperatingSystemsUseCase(operatingSystemRepo);
export const listOperatingSystemsController = new ListOperatingSystemsController(
  listOperatingSystemsUseCase,
);
