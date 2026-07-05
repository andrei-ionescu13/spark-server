import { UseCaseErrors } from '../../../AppError';
import { CollectionCommandsRepoI } from '../../../collection/repo/commands';
import { KeyCommandsRepoI } from '../../../key/repo/commands';
import { KeyQueriesRepoI } from '../../../key/repo/queries';
import { Result } from '../../../Result';
import { ReviewCommandsRepoI } from '../../../review/repo/commands';
import { ReviewQueriesRepoI } from '../../../review/repo/queries';
import { UserCommandsRepoI } from '../../../users/repo/commands';
import { ProductCommandsRepoI } from '../../repo/commands';
import { DeleteProductRequestDto } from './deleteProductRequestDto';

type Response = Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class DeleteProductUseCase implements UseCase<DeleteProductRequestDto, Response> {
  constructor(
    private productCommandsRepo: ProductCommandsRepoI,
    private collectionCommandsRepo: CollectionCommandsRepoI,
    private discountRepo: DiscountRepoI,
    private reviewCommandsRepo: ReviewCommandsRepoI,
    private reviewQueriesRepo: ReviewQueriesRepoI,
    private userCommandsRepo: UserCommandsRepoI,
    private keyCommandsRepo: KeyCommandsRepoI,
    private keyQueriesRepo: KeyQueriesRepoI,
    private couponRepo: CouponRepoI,
    private uploaderService: UploaderService,
  ) {}

  deleteReview = async (
    id: string,
  ): Promise<Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.DomainValidation>> => {
    const review = await this.reviewQueriesRepo.getReview(id);
    if (!review) return Result.fail(new UseCaseErrors.NotFound('Review not found'));

    const userOrError = await this.userCommandsRepo.getUser(review.user._id);
    if (userOrError.isErr()) {
      return Result.fail(new UseCaseErrors.DomainValidation(userOrError.error.message));
    }

    const user = userOrError.value;
    if (!user) {
      return Result.fail(new UseCaseErrors.NotFound('User not found'));
    }

    const removeUserReviewResult = user.removeReview(review._id);
    if (removeUserReviewResult.isErr()) {
      return Result.fail(new UseCaseErrors.NotFound(removeUserReviewResult.error.message));
    }

    await this.reviewCommandsRepo.deleteReview(id);
    await this.userCommandsRepo.save(user);

    return Result.ok();
  };

  deleteKey = async (id: string) => {
    const key = await this.keyQueriesRepo.getKey(id);

    if (!key) {
      return Result.fail(new UseCaseErrors.NotFound('Key not found'));
    }

    await this.keyCommandsRepo.deleteKey(id);
  };

  execute = async (request: DeleteProductRequestDto): Promise<Response> => {
    const { productId } = request;

    try {
      const productOrError = await this.productCommandsRepo.getProduct(productId);
      if (productOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(productOrError.error.message));
      }

      const product = productOrError.value;
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      await Promise.all(product.reviews.map((review) => this.deleteReview(review)));
      await Promise.all(product.keys.map((key) => this.deleteKey(key)));

      await this.uploaderService.delete(product.cover.publicId);
      await Promise.all(product.images.map((image) => this.uploaderService.delete(image.publicId)));

      await this.productCommandsRepo.deleteProduct(productId);

      const collectionOrError = await this.collectionCommandsRepo.getCollectionsByProduct(
        product._id,
      );

      if (collectionOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(collectionOrError.error.message));
      }

      const collection = collectionOrError.value;
      if (!collection) {
        return left(new UseCaseErrors.NotFound('Collection not found'));
      }
      const removeProductFromCollectionResult = collection.removeProduct;
      await this.discountRepo.removeProductFromDiscounts(product._id);
      await this.couponRepo.removeProductFromCoupons(product._id);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
