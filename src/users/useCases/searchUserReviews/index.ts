import { UserModel } from '../../model';
import { UserRepo } from '../../userRepo';
import { SearchUserReviewsController } from './searchUserReviewsController';
import { SearchUserReviewsUseCase } from './searchUserReviewsUseCase';

const userRepo = new UserRepo(UserModel);
const searchUserReviewsUseCase = new SearchUserReviewsUseCase(userRepo);
export const searchUserReviewsController = new SearchUserReviewsController(
  searchUserReviewsUseCase,
);
