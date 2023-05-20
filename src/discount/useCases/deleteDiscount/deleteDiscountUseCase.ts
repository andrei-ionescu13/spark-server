import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { DiscountRepoI } from '../../discountRepo';
import { DeleteDiscountRequestDto } from './deleteDiscountRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteDiscountUseCase implements UseCase<DeleteDiscountRequestDto, Response> {
  constructor(private discountRepo: DiscountRepoI, private productRepo: ProductRepoI) {}

  execute = async (request: DeleteDiscountRequestDto): Promise<Response> => {
    const { discountId } = request;

    try {
      const discount = await this.discountRepo.getDiscount(discountId);

      if (!discount) {
        return left(new AppError.NotFound('Discount not found'));
      }

      await this.discountRepo.deleteDiscount(discountId);
      await discount.products.map((product) =>
        this.productRepo.updateProduct(product, { discount: null }),
      );

      return right(Result.ok<any>(discount));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
