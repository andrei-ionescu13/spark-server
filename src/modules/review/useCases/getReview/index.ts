import { Mongo } from '../../../../mongo';
import { ReviewQueriesRepo } from '../../repo/queries';
import { GetReviewController } from './getReviewController';
import { GetReviewUseCase } from './getReviewUseCase';

const reviewQueriesRepo = new ReviewQueriesRepo(Mongo.getCollection('reviews'));
const getReviewUseCase = new GetReviewUseCase(reviewQueriesRepo);
export const getReviewController = new GetReviewController(getReviewUseCase);
