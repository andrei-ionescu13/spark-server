import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { KeyRepoI } from '../../keyRepo';
import { ImportKeysRequestDto } from './importKeysRequestDto';

export namespace ImportKeysErrors {
  export class KeyForPlatformExists extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'One or more keys could not be added' });
    }
  }
}

type Response = Either<
  ImportKeysErrors.KeyForPlatformExists | AppError.UnexpectedError,
  Result<any>
>;

export class ImportKeysUseCase implements UseCase<ImportKeysRequestDto, Response> {
  constructor(private keyRepo: KeyRepoI, private productRepo: ProductRepoI) {}

  createKey = async (
    productId,
    value,
  ): Promise<AppError.NotFound | ImportKeysErrors.KeyForPlatformExists | Result<string>> => {
    const product = await this.productRepo.getProduct(productId);
    const productFound = !!product;

    if (!productFound) {
      return new AppError.NotFound('Product not found');
    }

    let key = await this.keyRepo.getKeyByValue(value);
    const keyFound = !!key;

    if (keyFound) {
      const productsByKeyFound = await this.productRepo.searchProductsByKeys(value);
      let samePlatform;

      if (productsByKeyFound.length) {
        for (const productByKeyFound of productsByKeyFound) {
          if (
            productByKeyFound.platform._id.toString() === productByKeyFound.platform._id.toString()
          ) {
            samePlatform = productByKeyFound.platform;
            break;
          }
        }
      }

      const isSamePlatform = !!samePlatform;

      if (isSamePlatform) {
        return new ImportKeysErrors.KeyForPlatformExists();
      }
    }

    key = await this.keyRepo.createKey({
      product: productId,
      value,
    });

    await this.productRepo.addProductKey(productId, key);

    return Result.ok<string>(key._id);
  };

  execute = async (request: ImportKeysRequestDto): Promise<Response> => {
    const { keysFile } = request;
    const keysItems = JSON.parse(keysFile.buffer.toString());

    try {
      const results = await Promise.all(
        keysItems.map((item) => item.keys.map((key) => this.createKey(item.productId, key))),
      );

      const combinedResult = Result.combine(results);

      return combinedResult.isFailure ? left(combinedResult) : right(combinedResult);
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
