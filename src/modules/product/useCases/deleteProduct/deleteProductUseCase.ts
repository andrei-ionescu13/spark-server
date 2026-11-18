import { UseCaseErrors } from '../../../../appError';
import { Result } from '../../../../result';
import { UseCase } from '../../../../useCase';
import { ProductCommandsRepoI } from '../../repo/commands';
import { DeleteProductRequestDto } from './deleteProductController';
import { UploaderService } from '../../../../services/uploaderService';
import { ReviewCommandsRepoI } from '../../../review/repo/commands';
import { ReviewQueriesRepo, ReviewQueriesRepoI } from '../../../review/repo/queries';
import { UserCommandsRepoI } from '../../../users/repo/commands';
import { KeyQueriesRepoI } from '../../../key/repo/queries';
import { KeyCommandsRepoI } from '../../../key/repo/commands';
import { CollectionCommandsRepo, CollectionCommandsRepoI } from '../../../collection/repo/commands';
import { DiscountCommandsRepoI } from '../../../discount/repo/commands';
import { CouponCommandsRepoI } from '../../../coupon/repo/commands';

//TODO finish the usecase

type Response = Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class DeleteProductUseCase implements UseCase<DeleteProductRequestDto, Response> {
  constructor(
    private productCommandsRepo: ProductCommandsRepoI,
    private reviewCommandsRepo: ReviewCommandsRepoI,
    private reviewQueriesRepo: ReviewQueriesRepoI,
    private userCommandsRepo: UserCommandsRepoI,
    private keyQueriesRepo: KeyQueriesRepoI,
    private keyCommandsRepo: KeyCommandsRepoI,
    private uploaderService: UploaderService,
    private collectionCommandsRepo: CollectionCommandsRepoI,
    private discountCommandsRepo: DiscountCommandsRepoI,
    private couponCommandsRepo: CouponCommandsRepoI,
  ) {}

  deleteReview = async (
    id: string,
  ): Promise<Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.DomainValidation>> => {
    const review = await this.reviewQueriesRepo.getReview(id);
    if (!review) return Result.fail(new UseCaseErrors.NotFound('Review not found'));

    const user = await this.userCommandsRepo.getUser(review.user._id);
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
      const product = await this.productCommandsRepo.getProduct(productId);
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      await Promise.all(product.reviews.map((review) => this.deleteReview(review)));
      await Promise.all(product.keys.map((key) => this.deleteKey(key)));

      await this.uploaderService.delete(product.cover.publicId);
      await Promise.all(
        product.allImages.map((image) => this.uploaderService.delete(image.publicId)),
      );

      await this.productCommandsRepo.deleteProduct(productId);
      const collections = await this.collectionCommandsRepo.getCollectionsByProduct(product._id);

      collections.forEach((collection) => {
        collection.removeProduct(product._id);
      });

      await this.discountCommandsRepo.deleteDiscountsByProductId(product._id);
      const coupons = await this.couponCommandsRepo.listCouponsByProductId(product._id);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
