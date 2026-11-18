import { Mongo } from '../../../../mongo';
import { AuthService } from '../../authService';
import { AdminQueriesRepo } from '../../repo/admin/queries';
import { TokenCommandsRepo } from '../../repo/token/commands';
import { GetAccessTokenController } from './getAccessTokenController';
import { GetAccessTokenUseCase } from './getAccessTokenUseCase';

const adminQueriesRepo = new AdminQueriesRepo();
const tokenCommandsRepo = new TokenCommandsRepo();

const authService = new AuthService();

const getAccessTokenUseCase = new GetAccessTokenUseCase(
  adminQueriesRepo,
  tokenCommandsRepo,
  authService,
);
export const getAccessTokenController = new GetAccessTokenController(getAccessTokenUseCase);
