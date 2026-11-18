import { Mongo } from '../../../../mongo';
import { AdminQueriesRepo } from '../../repo/admin/queries';
import { GetAdminController } from './getAdminController';
import { GetAdminUseCase } from './getAdminUseCase';

const adminQueriesRepo = new AdminQueriesRepo();
const getAdminUseCase = new GetAdminUseCase(adminQueriesRepo);
export const getAdminController = new GetAdminController(getAdminUseCase);
