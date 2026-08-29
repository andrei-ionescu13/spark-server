import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { ProductDto } from '../../productMapper';
import { ProductRepoI } from '../../productRepo';
import { ProductQueriesRepoI } from '../../repo/queries';
import { GetProductRequestDto } from './getProductRequestDto';

type Response = Result<ProductDto, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class GetProductUseCase implements UseCase<GetProductRequestDto, Response> {
  constructor(private productQueriesRepo: ProductQueriesRepoI) {}

  execute = async (request: GetProductRequestDto): Promise<Response> => {
    const { productId } = request;

    try {
      const product = await this.productQueriesRepo.getProduct(productId);
      const found = !!product;

      if (!found) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      return Result.ok(product);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
