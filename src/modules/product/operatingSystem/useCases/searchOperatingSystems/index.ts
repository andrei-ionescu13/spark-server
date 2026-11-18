import { Mongo } from '../../../../../mongo';
import { OperatingSystemQueriesRepo } from '../../repo/queries';
import { SearchOperatingSystemController } from './searchOperatingSystemsController';
import { SearchOperatingSystemsUseCase } from './searchOperatingSystemsUseCase';

const operatingSystemQueriesRepo = new OperatingSystemQueriesRepo();

const searchOperatingSystemsUseCase = new SearchOperatingSystemsUseCase(operatingSystemQueriesRepo);

export const searchOperatingSystemController = new SearchOperatingSystemController(
  searchOperatingSystemsUseCase,
);
