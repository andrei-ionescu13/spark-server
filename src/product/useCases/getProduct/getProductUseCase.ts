import { UseCaseErrors } from '../../../src/AppError';
import { Either, Result, left, right } from '../../../src/Result';
import { UseCase } from '../../../src/use-case';
import { ProductRepoI } from '../../productRepo';
import { GetProductRequestDto } from './getProductRequestDto';

type Response = Either<UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound, Result<any>>;

export class GetProductUseCase implements UseCase<GetProductRequestDto, Response> {
  constructor(private productRepo: ProductRepoI) {}

  execute = async (request: GetProductRequestDto): Promise<Response> => {
    const { productId } = request;

    try {
      const product = await this.productRepo.getProduct(productId);
      const found = !!product;

      if (!found) {
        return left(new UseCaseErrors.NotFound('Product not found'));
      }

      return right(Result.ok<any>(product));
    } catch (error) {
      console.log(error);
      return left(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
