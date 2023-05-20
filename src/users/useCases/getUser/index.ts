import { UserModel } from '../../model';
import { UserRepo } from '../../userRepo';
import { GetUserController } from './getUserController';
import { GetUserUseCase } from './getUserUseCase';

const userRepo = new UserRepo(UserModel);
const getUserUseCase = new GetUserUseCase(userRepo);
export const getUserController = new GetUserController(getUserUseCase);
