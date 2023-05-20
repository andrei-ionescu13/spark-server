import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ProductRepoI } from '../../productRepo';
import { UpdateProductMetaRequestDto } from './updateProductMetaRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class UpdateProductMetaUseCase implements UseCase<UpdateProductMetaRequestDto, Response> {
  constructor(private productRepo: ProductRepoI) {}

  execute = async (request: UpdateProductMetaRequestDto): Promise<Response> => {
    const { productId, ...rest } = request;
    const props: any = rest;

    try {
      const product = await this.productRepo.getProduct(productId);
      const found = !!product;

      if (!found) {
        return left(new AppError.NotFound('Product not found'));
      }

      const updatedProduct = await this.productRepo.updateProduct(productId, props);
      const { metaTitle, metaKeywords, metaDescription } = updatedProduct;

      return right(Result.ok<any>({ metaTitle, metaKeywords, metaDescription }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
