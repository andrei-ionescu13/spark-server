import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { textUtils } from '../../../utils/textUtils';
import { ProductRepoI } from '../../productRepo';
import { productServices } from '../../services';
import { UpdateProductDetailsRequestDto } from './updateProductDetailsRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

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
        return left(new AppError.NotFound('Product not found'));
      }

      const updatedProduct = await this.productRepo.updateProduct(productId, props);

      return right(Result.ok<any>(updatedProduct));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
