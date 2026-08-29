import { Result } from '../../Result';
import { DomainValidationError } from '../blog/article/status';
import { Review } from '../review/review';
import { Product } from './product';
import { ProductRating } from './productRating';
import { ProductRepo } from './productRepo';

const calculateRating = (reviews: Review[]): Result<ProductRating, DomainValidationError> => {
  const distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  reviews.forEach((review) => {
    distribution[review.rating.value] = 1;
  });

  const publishedReviews = reviews.filter((review) => review.status.value === 'published');
  const average = publishedReviews.length
    ? parseFloat(
        (
          publishedReviews.reduce((acc, review) => acc + review.rating.value, 0) /
          publishedReviews.length
        ).toFixed(2),
      )
    : 0;

  const ratingOrError = ProductRating.create({ distribution, average });
  if (ratingOrError.isErr())
    return Result.fail(new DomainValidationError(ratingOrError.error.message));

  const rating = ratingOrError.value;
  return Result.ok(rating);
};

export const productServices = {
  calculateRating,
};
