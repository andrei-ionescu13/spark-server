import { Mongo } from '../../../../mongo';
import { UserQueriesRepo } from '../../repo/queries';
import { SearchUserReviewsController } from './searchUserReviewsController';
import { SearchUserReviewsUseCase } from './searchUserReviewsUseCase';

const userQueriesRepo = new UserQueriesRepo(Mongo.getCollection('users'));
const searchUserReviewsUseCase = new SearchUserReviewsUseCase(userQueriesRepo);
export const searchUserReviewsController = new SearchUserReviewsController(
  searchUserReviewsUseCase,
);
