import { AdminRepo } from '../../adminRepo';
import { AdminModel } from '../../model';
import { RegisterController } from './registerController';
import { RegisterUseCase } from './registerUseCase';

const adminRepo = new AdminRepo(AdminModel);
const registerUseCase = new RegisterUseCase(adminRepo);
export const registerController = new RegisterController(registerUseCase);
