import { AdminModel } from '../../model';
import { AdminCommandsRepo } from '../../repo/admin/commands';
import { AdminQueriesRepo } from '../../repo/admin/queries';
import { RegisterController } from './registerController';
import { RegisterUseCase } from './registerUseCase';

const adminCommandsRepo = new AdminCommandsRepo(AdminModel);
const adminQueriesRepo = new AdminQueriesRepo(AdminModel);
const registerUseCase = new RegisterUseCase(adminCommandsRepo, adminQueriesRepo);
export const registerController = new RegisterController(registerUseCase);
