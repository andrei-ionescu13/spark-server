import { productServices } from '../product/index';
import { userDb } from '../users/index';
import { reviewDb } from './index';
import { NotFoundError } from '../errors';

const createReview = async (props) => {
  const review = await reviewDb.createReview(props);
  return review;
};

const getReview = async (id) => {
  const review = await reviewDb.getReview(id);
  return review;
};

const deleteReview = async (id) => {
  const review = await reviewDb.getReview(id);

  if (!review) {
    throw new NotFoundError('review not found');
  }

  await reviewDb.deleteReview(id);
  await productServices.deleteReview(review.product._id, review._id);

  const user = await userDb.getUser(review.user._id);

  if (!user) {
    throw new NotFoundError('user not found');
  }

  await userDb.deleteReview(review.user._id, review);

  return review;
};

const searchReviews = async (query) => {
  const reviews = await reviewDb.searchReviews(query);
  const count = await reviewDb.getReviewsCount(query);

  return {
    reviews,
    count,
  };
};

const updateReviewStatus = async (id, status) => {
  const updated = await reviewDb.updateReview(id, { status });
  await productServices.calculateRating(updated.product._id);

  return updated;
};

export const reviewServices = {
  searchReviews,
  createReview,
  deleteReview,
  getReview,
  updateReviewStatus,
};
