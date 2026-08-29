import { textUtils } from '../../../../../utils/textUtils';
import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { ProductRepoI } from '../../productRepo';
import { ProductCommandsRepoI } from '../../repo/commands';
import { UpdateProductDetailsRequestDto } from './updateProductDetailsRequestDto';

type Response = Result<void, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateProductDetailsUseCase
  implements UseCase<UpdateProductDetailsRequestDto, Response>
{
  constructor(private productCommandsRepo: ProductCommandsRepoI) {}

  execute = async (request: UpdateProductDetailsRequestDto): Promise<Response> => {
    const { productId, ...rest } = request;
    const props: any = rest;
    props.slug ??= textUtils.generateSlug(props.title);

    try {
      const productOrError = await this.productCommandsRepo.getProduct(productId);
      if (productOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(productOrError.error.message));

      const product = productOrError.value;
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      const successOrError = product.updateDetails(props);
      if (successOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(successOrError.error.message));

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
