import { AuthService } from '../../../authService';
import { AdminModel, TokenModel } from '../../model';
import { AdminCommandsRepo } from '../../repo/admin/commands';
import { TokenCommandsRepo } from '../../repo/token/commands';
import { TokenRepo } from '../../tokenRepo';
import { LoginController } from './loginController';
import { LoginUseCase } from './loginUseCase';

const adminCommandsRepo = new AdminCommandsRepo(AdminModel);
const tokenCommandsRepo = new TokenCommandsRepo(TokenModel);

const authService = new AuthService();

const loginUseCase = new LoginUseCase(adminCommandsRepo, tokenCommandsRepo, authService);
export const loginController = new LoginController(loginUseCase);
