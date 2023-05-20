import { AdminRepo } from './adminRepo';
import { TokenRepo } from './tokenRepo';
import { AdminModel, TokenModel } from './model';
export { default as authRoutes } from './routes';

export const adminDb = new AdminRepo(AdminModel);
export const tokenDb = new TokenRepo(TokenModel);
