import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { KeyRepoI } from '../../keyRepo';
import { CreateKeyRequestDto } from './createKeyRequestDto';

export namespace CreateKeyErrors {
  export class KeyForPlatformExists extends Result<UseCaseError> {
    constructor(productId, platform) {
      super(false, { message: `Key for ${productId} exists for the ${platform} platform` });
    }
  }
}

type Response = Either<
  CreateKeyErrors.KeyForPlatformExists | AppError.UnexpectedError | AppError.NotFound,
  Result<any>
>;

export class CreateKeyUseCase implements UseCase<CreateKeyRequestDto, Response> {
  constructor(private keyRepo: KeyRepoI, private productRepo: ProductRepoI) {}

  execute = async (request: CreateKeyRequestDto): Promise<Response> => {
    const { productId, value } = request;

    try {
      const product = await this.productRepo.getProduct(productId);
      const productFound = !!product;

      if (!productFound) {
        return left(new AppError.NotFound('Product not found'));
      }

      let key = await this.keyRepo.getKeyByValue(value);
      const keyFound = !!key;

      if (keyFound) {
        const productsByKeyFound = await this.productRepo.searchProductsByKeys(value);
        let samePlatform;

        if (productsByKeyFound.length) {
          for (const productByKeyFound of productsByKeyFound) {
            if (
              productByKeyFound.platform._id.toString() ===
              productByKeyFound.platform._id.toString()
            ) {
              samePlatform = productByKeyFound.platform;
              break;
            }
          }
        }

        const isSamePlatform = !!samePlatform;
        if (isSamePlatform) {
          return left(new CreateKeyErrors.KeyForPlatformExists(productId, samePlatform.name));
        }
      }

      key = await this.keyRepo.createKey({
        product: productId,
        value,
      });

      await this.productRepo.addProductKey(productId, key);

      return right(Result.ok<any>(key._id));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
