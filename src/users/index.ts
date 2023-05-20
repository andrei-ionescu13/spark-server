import { UserRepo } from './userRepo';
import { UserModel } from './model';
export { default as userRoutes } from './routes';

export const userDb = new UserRepo(UserModel);
