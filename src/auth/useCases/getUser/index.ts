import { AdminRepo } from '../../adminRepo';
import { AdminModel } from '../../model';
import { GetUserController } from './getUserController';
import { GetUserUseCase } from './getUserUseCase';

const adminRepo = new AdminRepo(AdminModel);
const getUserUseCase = new GetUserUseCase(adminRepo);
export const getUserController = new GetUserController(getUserUseCase);
