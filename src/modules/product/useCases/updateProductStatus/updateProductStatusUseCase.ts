import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../result';
import { UseCase } from '../../../../useCase';
import { ProductStatus } from '../../domain/productStatus';
import { ProductCommandsRepoI } from '../../repo/commands';
import { UpdateProductStatusRequestDto } from './updateProductStatusRequestDto';

type Response = Result<string, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateProductStatusUseCase
  implements UseCase<UpdateProductStatusRequestDto, Response>
{
  constructor(private productCommandsRepo: ProductCommandsRepoI) {}

  execute = async (request: UpdateProductStatusRequestDto): Promise<Response> => {
    try {
      const product = await this.productCommandsRepo.getProduct(request.productId);
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      const productStatusOrError = ProductStatus.create(request.status);
      if (productStatusOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(productStatusOrError.error.message));

      const productStatus = productStatusOrError.value;
      product.updateStatus(productStatus);

      await this.productCommandsRepo.save(product);
      return Result.ok(product.status.value);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
