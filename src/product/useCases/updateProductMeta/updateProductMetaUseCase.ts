import { UseCaseErrors } from '../../../src/AppError';
import { Either, Result, left, right } from '../../../src/Result';
import { UseCase } from '../../../src/use-case';
import { ProductRepoI } from '../../productRepo';
import { UpdateProductMetaRequestDto } from './updateProductMetaRequestDto';

type Response = Either<UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound, Result<any>>;

export class UpdateProductMetaUseCase implements UseCase<UpdateProductMetaRequestDto, Response> {
  constructor(private productRepo: ProductRepoI) {}

  execute = async (request: UpdateProductMetaRequestDto): Promise<Response> => {
    const { productId, ...rest } = request;
    const props: any = rest;

    try {
      const product = await this.productRepo.getProduct(productId);
      const found = !!product;

      if (!found) {
        return left(new UseCaseErrors.NotFound('Product not found'));
      }

      const updatedProduct = await this.productRepo.updateProduct(productId, props);
      const { metaTitle, metaKeywords, metaDescription } = updatedProduct;

      return right(Result.ok<any>({ metaTitle, metaKeywords, metaDescription }));
    } catch (error) {
      console.log(error);
      return left(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
