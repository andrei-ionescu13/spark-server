import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { DiscountRepoI } from '../../discountRepo';
import { DeleteDiscountsBulkRequestDto } from './deleteDiscountsBulkRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteDiscountsBulkUseCase
  implements UseCase<DeleteDiscountsBulkRequestDto, Response>
{
  constructor(private discountRepo: DiscountRepoI, private productRepo: ProductRepoI) {}

  deleteDiscount = async (discountId: string) => {
    const discount = await this.discountRepo.getDiscount(discountId);

    if (!discount) {
      return left(new AppError.NotFound('Discount not found'));
    }

    await this.discountRepo.deleteDiscount(discountId);
    await discount.products.map((product) =>
      this.productRepo.updateProduct(product, { discount: null }),
    );

    return right(Result.ok<any>(discount));
  };

  execute = async (request: DeleteDiscountsBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      await Promise.all(ids.map((discountId) => this.deleteDiscount(discountId)));

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
