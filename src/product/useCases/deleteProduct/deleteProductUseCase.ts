import { CollectionRepoI } from '../../../collection/collectionRepo';
import { CouponRepoI } from '../../../coupon/couponRepo';
import { DiscountRepoI } from '../../../discount/discountRepo';
import { KeyRepoI } from '../../../key/keyRepo';
import { ReviewRepoI } from '../../../review/reviewRepo';
import { UseCaseErrors } from '../../../src/AppError';
import { Either, Result, left, right } from '../../../src/Result';
import { UploaderService } from '../../../src/services/uploaderService';
import { UseCase } from '../../../src/use-case';
import { UserRepoI } from '../../../users/userRepo';
import { ProductRepoI } from '../../productRepo';
import { productServices } from '../../services';
import { DeleteProductRequestDto } from './deleteProductRequestDto';

type Response = Either<UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound, Result<any>>;

export class DeleteProductUseCase implements UseCase<DeleteProductRequestDto, Response> {
  constructor(
    private productRepo: ProductRepoI,
    private collectionRepo: CollectionRepoI,
    private discountRepo: DiscountRepoI,
    private reviewRepo: ReviewRepoI,
    private userRepo: UserRepoI,
    private keyRepo: KeyRepoI,
    private couponRepo: CouponRepoI,
    private uploaderService: UploaderService,
  ) {}

  deleteReview = async (id) => {
    const review = await this.reviewRepo.getReview(id);

    if (!review) {
      return left(new UseCaseErrors.NotFound('Review not found'));
    }

    await this.reviewRepo.deleteReview(id);

    const product = await this.productRepo.getProduct(review.product._id);

    if (!product) {
      return left(new UseCaseErrors.NotFound('Product not found'));
    }

    await this.productRepo.deleteReview(review.product._id, review._id);
    await productServices.calculateRating(review.product._id);

    const user = await this.userRepo.getUser(review.user._id);

    if (!user) {
      return left(new UseCaseErrors.NotFound('User not found'));
    }

    await this.userRepo.deleteReview(review.user._id, review);

    return review;
  };

  deleteKey = async (id) => {
    const key = await this.keyRepo.getKey(id);

    if (!key) {
      return left(new UseCaseErrors.NotFound('Key not found'));
    }

    const product = await this.productRepo.getProductByKey(id);

    if (!product) {
      return left(new UseCaseErrors.NotFound('Product not found'));
    }

    await this.keyRepo.deleteKey(id);
    await this.productRepo.deleteProductKey(product._id, id);
  };

  execute = async (request: DeleteProductRequestDto): Promise<Response> => {
    const { productId } = request;

    try {
      const product = await this.productRepo.getProduct(productId);

      if (!product) {
        return left(new UseCaseErrors.NotFound('Product not found'));
      }

      await Promise.all(product.reviews.map((review) => this.deleteReview(review)));
      await Promise.all(product.keys.map((key) => this.deleteKey(key)));

      await this.uploaderService.delete(product.cover.public_id);
      await Promise.all(
        product.images.map((image) => this.uploaderService.delete(image.public_id)),
      );

      await this.productRepo.deleteProduct(productId);
      await this.collectionRepo.removeProductFromCollections(product._id);
      await this.discountRepo.removeProductFromDiscounts(product._id);
      await this.couponRepo.removeProductFromCoupons(product._id);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
