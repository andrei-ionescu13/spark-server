import { Mongo } from '../../../../mongo';
import { AuthService } from '../../authService';
import { AdminCommandsRepo } from '../../repo/admin/commands';
import { TokenCommandsRepo } from '../../repo/token/commands';
import { LoginController } from './loginController';
import { LoginUseCase } from './loginUseCase';

const adminCommandsRepo = new AdminCommandsRepo(Mongo.getCollection('admins'));
const tokenCommandsRepo = new TokenCommandsRepo(Mongo.getCollection('token'));

const authService = new AuthService();

const loginUseCase = new LoginUseCase(adminCommandsRepo, tokenCommandsRepo, authService);
export const loginController = new LoginController(loginUseCase);
