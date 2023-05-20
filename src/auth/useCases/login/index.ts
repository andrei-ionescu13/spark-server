import { AuthService } from '../../../services/authService';
import { AdminRepo } from '../../adminRepo';
import { AdminModel, TokenModel } from '../../model';
import { TokenRepo } from '../../tokenRepo';
import { LoginController } from './loginController';
import { LoginUseCase } from './loginUseCase';

const adminRepo = new AdminRepo(AdminModel);
const tokeRepo = new TokenRepo(TokenModel);

const authService = new AuthService();

const loginUseCase = new LoginUseCase(adminRepo, tokeRepo, authService);
export const loginController = new LoginController(loginUseCase);
