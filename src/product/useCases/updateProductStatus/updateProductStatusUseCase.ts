import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ProductRepoI } from '../../productRepo';
import { UpdateProductStatusRequestDto } from './updateProductStatusRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class UpdateProductStatusUseCase
  implements UseCase<UpdateProductStatusRequestDto, Response>
{
  constructor(private productRepo: ProductRepoI) {}

  execute = async (request: UpdateProductStatusRequestDto): Promise<Response> => {
    const { productId, status } = request;

    try {
      const product = await this.productRepo.getProduct(productId);
      const found = !!product;

      if (!found) {
        return left(new AppError.NotFound('Product not found'));
      }

      const updatedProduct = await this.productRepo.updateProduct(productId, { status });

      return right(Result.ok<string>(updatedProduct.status));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
