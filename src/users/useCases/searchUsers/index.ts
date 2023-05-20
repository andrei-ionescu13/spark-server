import { UserModel } from '../../model';
import { UserRepo } from '../../userRepo';
import { SearchUsersController } from './searchUsersController';
import { SearchUsersUseCase } from './searchUsersUseCase';

const userRepo = new UserRepo(UserModel);
const searchUsersUseCase = new SearchUsersUseCase(userRepo);
export const searchUsersController = new SearchUsersController(searchUsersUseCase);
