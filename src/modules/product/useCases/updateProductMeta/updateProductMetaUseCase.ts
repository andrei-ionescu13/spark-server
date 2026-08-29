import { UseCaseErrors } from '../../../../AppError';
import { Meta } from '../../../../Meta';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { ProductRepoI } from '../../productRepo';
import { ProductCommandsRepoI } from '../../repo/commands';
import { UpdateProductMetaRequestDto } from './updateProductMetaRequestDto';

type Response = Result<void, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateProductMetaUseCase implements UseCase<UpdateProductMetaRequestDto, Response> {
  constructor(private productCommandsRepo: ProductCommandsRepoI) {}

  execute = async (request: UpdateProductMetaRequestDto): Promise<Response> => {
    const { productId, metaDescription, metaKeywords, metaTitle } = request;

    try {
      const productOrError = await this.productCommandsRepo.getProduct(productId);
      if (productOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(productOrError.error.message));

      const product = productOrError.value;
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      const metaOrError = Meta.create({
        description: metaDescription,
        keywords: metaKeywords,
        title: metaTitle,
      });
      if (metaOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(metaOrError.error.message));

      const meta = metaOrError.value;
      product.updateMeta(meta);
      await this.productCommandsRepo.save(product);
      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
