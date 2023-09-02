import { OperatingSystemRepo } from '../../operatingSystemRepo';
import { OperatingSystemModel } from '../../model';
import { SearchOperatingSystemsController } from './searchOperatingSystemsController';
import { SearchOperatingSystemsUseCase } from './searchOperatingSystemsUseCase';

const operatingSystemRepo = new OperatingSystemRepo(OperatingSystemModel);
const searchOperatingSystemsUseCase = new SearchOperatingSystemsUseCase(operatingSystemRepo);
export const searchOperatingSystemsController = new SearchOperatingSystemsController(
  searchOperatingSystemsUseCase,
);
