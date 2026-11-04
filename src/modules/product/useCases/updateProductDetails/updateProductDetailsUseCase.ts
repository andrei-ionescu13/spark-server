import { textUtils } from '../../../../utils/textUtils';
import { UseCaseErrors } from '../../../../appError';
import { Result } from '../../../../result';
import { UseCase } from '../../../../useCase';
import { DiscountCommandsRepoI } from '../../../discount/repo/commands';
import { Product, UpdateProductDetailsProps } from '../../domain/product';
import { ProductLink } from '../../domain/productLink';
import { ProductMarkdown } from '../../domain/productMarkdown';
import { ProductPrice } from '../../domain/productPrice';
import { ProductRequirements } from '../../domain/productRequirements';
import { ProductTitle } from '../../domain/productTitle';
import { ProductCommandsRepoI } from '../../repo/commands';
import { UpdateProductDetailsRequestDto } from './updateProductDetailsRequestDto';

export namespace UpdateProductDetailsErrors {
  export class DiscountNotExpired extends Error {
    constructor() {
      super('Cannot update the price if the product has a discount active');
    }
  }
}

type Response = Result<string, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateProductDetailsUseCase
  implements UseCase<UpdateProductDetailsRequestDto, Response>
{
  constructor(
    private productCommandsRepo: ProductCommandsRepoI,
    private discountCommandsRepo: DiscountCommandsRepoI,
  ) {}

  execute = async (request: UpdateProductDetailsRequestDto): Promise<Response> => {
    try {
      const product = await this.productCommandsRepo.getProduct(request.productId);
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      if (product.discount && product.price.value !== request.price) {
        const discount = await this.discountCommandsRepo.getDiscount(product.discount);
        if (!discount) {
          return Result.fail(new UseCaseErrors.NotFound('Discount not found'));
        }

        if (!discount.isExpired) {
          return Result.fail(new UpdateProductDetailsErrors.DiscountNotExpired());
        }
      }

      const titleOrError = ProductTitle.create(request.title);
      const priceOrError = ProductPrice.create(request.price);
      const markdownOrError = ProductMarkdown.create(request.markdown);
      const minimumRequirementsOrError = ProductRequirements.create(request.minimumRequirements);
      const recommendedRequirementsOrError = ProductRequirements.create(
        request.recommendedRequirements,
      );

      const combinedResult = Result.combine([
        titleOrError,
        priceOrError,
        markdownOrError,
        minimumRequirementsOrError,
        recommendedRequirementsOrError,
      ]);
      if (combinedResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(combinedResult.error.message));
      }

      const [title, price, markdown, minimumRequirements, recommendedRequirements] =
        combinedResult.value;

      const props: UpdateProductDetailsProps = {
        title,
        price,
        genres: request.genres,
        releaseDate: request.releaseDate,
        publisher: request.publisher,
        platform: request.platform,
        developers: request.developers,
        features: request.features,
        link: null,
        os: request.os,
        markdown,
        minimumRequirements,
        recommendedRequirements,
        slug: request.slug,
      };

      if (request.link) {
        const linkOrError = ProductLink.create(request.link);
        if (linkOrError.isErr()) {
          return Result.fail(new UseCaseErrors.DomainValidation(linkOrError.error.message));
        }

        const link = linkOrError.value;
        props.link = link;
      }

      const successOrError = product.updateDetails(props);
      if (successOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(successOrError.error.message));

      this.productCommandsRepo.save(product);
      return Result.ok(product._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
