import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { ProductRepoI } from '../../productRepo';
import { ProductStatus } from '../../productStatus';
import { ProductCommandsRepoI } from '../../repo/commands';
import { UpdateProductStatusRequestDto } from './updateProductStatusRequestDto';

type Response = Result<void, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateProductStatusUseCase
  implements UseCase<UpdateProductStatusRequestDto, Response>
{
  constructor(private productCommandsRepo: ProductCommandsRepoI) {}

  execute = async (request: UpdateProductStatusRequestDto): Promise<Response> => {
    const { productId, status } = request;

    try {
      const productOrError = await this.productCommandsRepo.getProduct(productId);
      if (productOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(productOrError.error.message));

      const product = productOrError.value;
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      const productStatusOrError = ProductStatus.create(status);
      if (productStatusOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(productStatusOrError.error.message));

      const productStatus = productStatusOrError.value;
      product.updateStatus(productStatus);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
