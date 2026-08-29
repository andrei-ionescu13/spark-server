import { Mongo } from '../../../../../mongo';
import { OperatingSystemQueriesRepo } from '../../repo/queries';
import { ListOperatingSystemsController } from './listOperatingSystemsController';
import { ListOperatingSystemsUseCase } from './listOperatingSystemsUseCase';

const operatingSystemQueriesRepo = new OperatingSystemQueriesRepo(
  Mongo.getCollection('operating_systems'),
);

const listOperatingSystemsUseCase = new ListOperatingSystemsUseCase(operatingSystemQueriesRepo);

export const listOperatingSystemsController = new ListOperatingSystemsController(
  listOperatingSystemsUseCase,
);
