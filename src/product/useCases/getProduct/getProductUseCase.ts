import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ProductRepoI } from '../../productRepo';
import { GetProductRequestDto } from './getProductRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class GetProductUseCase implements UseCase<GetProductRequestDto, Response> {
  constructor(private productRepo: ProductRepoI) {}

  execute = async (request: GetProductRequestDto): Promise<Response> => {
    const { productId } = request;

    try {
      const product = await this.productRepo.getProduct(productId);
      const found = !!product;

      if (!found) {
        return left(new AppError.NotFound('Product not found'));
      }

      return right(Result.ok<any>(product));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
