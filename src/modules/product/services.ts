import { Result } from '../../results';
import { DomainValidationError } from '../blog/article/domain/status';
import { Review } from '../review/domain/review';
import { Product } from './domain/product';
import { ProductRating } from './domain/productRating';

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

  return ProductRating.create({ distribution, average });
};

export const productServices = {
  calculateRating,
};
