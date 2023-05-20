import { AuthService } from '../../../services/authService';
import { AdminRepo } from '../../adminRepo';
import { AdminModel, TokenModel } from '../../model';
import { TokenRepo } from '../../tokenRepo';
import { GetAccessTokenController } from './getAccessTokenController';
import { GetAccessTokenUseCase } from './getAccessTokenUseCase';

const adminRepo = new AdminRepo(AdminModel);
const tokeRepo = new TokenRepo(TokenModel);

const authService = new AuthService();

const getAccessTokenUseCase = new GetAccessTokenUseCase(adminRepo, tokeRepo, authService);
export const getAccessTokenController = new GetAccessTokenController(getAccessTokenUseCase);
