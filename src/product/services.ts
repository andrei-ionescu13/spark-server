import { NotFoundError } from '../errors';
import { ProductModel } from './model';
import { ProductRepo } from './productRepo';

const productRepo = new ProductRepo(ProductModel);

const calculateRating = async (id) => {
  const product = await productRepo.getProduct(id);

  if (!product) {
    throw new NotFoundError('product not found');
  }

  const reviews = await productRepo.listProductReviews(id);

  const rating: any = {};
  rating.distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  reviews.forEach((review) => {
    rating.distribution[review.rating] += 1;
  });

  const publishedReviews = reviews.filter((review) => review.status === 'published');
  rating.average = publishedReviews.length
    ? (
        publishedReviews.reduce((acc, review) => acc + review.rating, 0) / publishedReviews.length
      ).toFixed(2)
    : 0;

  await productRepo.updateProduct(product._id, { rating });
};

export const productServices = {
  calculateRating,
};
