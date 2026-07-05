import { UseCaseErrors } from '../../../AppError';
import { Either, Result, left, right } from '../../../src/Result';
import { UseCase } from '../../../src/use-case';
import { textUtils } from '../../../utils/textUtils';
import { ProductRepoI } from '../../productRepo';
import { UpdateProductDetailsRequestDto } from './updateProductDetailsRequestDto';

type Response = Either<UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound, Result<any>>;

export class UpdateProductDetailsUseCase
  implements UseCase<UpdateProductDetailsRequestDto, Response>
{
  constructor(private productRepo: ProductRepoI) {}

  execute = async (request: UpdateProductDetailsRequestDto): Promise<Response> => {
    const { productId, ...rest } = request;
    const props: any = rest;
    props.slug ??= textUtils.generateSlug(props.title);

    try {
      const product = await this.productRepo.getProduct(productId);
      const found = !!product;

      if (!found) {
        return left(new UseCaseErrors.NotFound('Product not found'));
      }

      const updatedProduct = await this.productRepo.updateProduct(productId, props);

      return right(Result.ok<any>(updatedProduct));
    } catch (error) {
      console.log(error);
      return left(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
