import { Mongo } from '../../../../mongo';
import { AdminCommandsRepo } from '../../repo/admin/commands';
import { AdminQueriesRepo } from '../../repo/admin/queries';
import { RegisterController } from './registerController';
import { RegisterUseCase } from './registerUseCase';

const adminCommandsRepo = new AdminCommandsRepo(Mongo.getCollection('admins'));
const adminQueriesRepo = new AdminQueriesRepo(Mongo.getCollection('admins'));
const registerUseCase = new RegisterUseCase(adminCommandsRepo, adminQueriesRepo);
export const registerController = new RegisterController(registerUseCase);
