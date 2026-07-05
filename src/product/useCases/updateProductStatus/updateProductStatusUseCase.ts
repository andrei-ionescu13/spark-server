import { UseCaseErrors } from '../../../AppError';
import { Either, Result, left, right } from '../../../src/Result';
import { UseCase } from '../../../src/use-case';
import { ProductRepoI } from '../../productRepo';
import { UpdateProductStatusRequestDto } from './updateProductStatusRequestDto';

type Response = Either<UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound, Result<any>>;

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
        return left(new UseCaseErrors.NotFound('Product not found'));
      }

      const updatedProduct = await this.productRepo.updateProduct(productId, { status });

      return right(Result.ok<string>(updatedProduct.status));
    } catch (error) {
      console.log(error);
      return left(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
