import { AuthService } from '../../../authService';
import { AdminModel, TokenModel } from '../../model';
import { AdminQueriesRepo } from '../../repo/admin/queries';
import { TokenCommandsRepo } from '../../repo/token/commands';
import { GetAccessTokenController } from './getAccessTokenController';
import { GetAccessTokenUseCase } from './getAccessTokenUseCase';

const adminQueriesRepo = new AdminQueriesRepo(AdminModel);
const tokenCommandsRepo = new TokenCommandsRepo(TokenModel);

const authService = new AuthService();

const getAccessTokenUseCase = new GetAccessTokenUseCase(
  adminQueriesRepo,
  tokenCommandsRepo,
  authService,
);
export const getAccessTokenController = new GetAccessTokenController(getAccessTokenUseCase);
