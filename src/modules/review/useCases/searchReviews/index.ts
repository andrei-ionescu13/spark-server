import { Mongo } from '../../../../mongo';
import { ReviewQueriesRepo } from '../../repo/queries';
import { SearchReviewsController } from './searchReviewsController';
import { SearchReviewsUseCase } from './searchReviewsUseCase';

const reviewQueriesRepo = new ReviewQueriesRepo(Mongo.getCollection('reviews'));
const searchReviewsUseCase = new SearchReviewsUseCase(reviewQueriesRepo);
export const searchReviewsController = new SearchReviewsController(searchReviewsUseCase);
