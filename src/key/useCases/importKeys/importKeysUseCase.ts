import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../AppError';
import { ProductCommandsRepoI } from '../../../product/repo/commands';
import { ProductQueriesRepoI } from '../../../product/repo/queries';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UseCaseError } from '../../../UseCaseError';
import { Key } from '../../key';
import { KeyAvailability } from '../../keyAvailability';
import { KeyStatus } from '../../keyStatus';
import { KeyValue } from '../../keyValue';
import { KeyCommandsRepoI } from '../../repo/commands';
import { KeyQueriesRepoI } from '../../repo/queries';
import { ImportKeysRequestDto } from './importKeysRequestDto';

export namespace ImportKeysErrors {
  export class KeyForPlatformExists extends UseCaseError {
    constructor() {
      super('One or more keys could not be added');
    }
  }
}

type Response = Result<
  undefined,
  ImportKeysErrors.KeyForPlatformExists | UseCaseErrors.UnexpectedError
>;

export class ImportKeysUseCase implements UseCase<ImportKeysRequestDto, Response> {
  constructor(
    private keyCommandsRepo: KeyCommandsRepoI,
    private keyQueriesRepo: KeyQueriesRepoI,
    private productCommandsRepo: ProductCommandsRepoI,
    private productQueriesRepo: ProductQueriesRepoI,
  ) {}

  createKey = async (
    productId: string,
    value: string,
  ): Promise<Result<string, UseCaseErrors.NotFound | ImportKeysErrors.KeyForPlatformExists>> => {
    const productOrError = await this.productCommandsRepo.getProduct(productId);

    if (productOrError.error) {
      return Result.fail(new UseCaseErrors.DomainValidation(productOrError.error.message));
    }

    const product = productOrError.value;

    if (!product) {
      return Result.fail(new UseCaseErrors.NotFound('Product not found'));
    }

    const keyFound = await this.keyQueriesRepo.getKeyByValue(value);

    if (keyFound) {
      const productsByKeyFound = await this.productQueriesRepo.searchProductsByKeys(value);
      let isSamePlatform = false;

      if (productsByKeyFound.length) {
        for (const productByKeyFound of productsByKeyFound) {
          if (
            productByKeyFound.platform._id.toString() === productByKeyFound.platform._id.toString()
          ) {
            isSamePlatform = true;
            break;
          }
        }
      }

      if (isSamePlatform) {
        return Result.fail(new ImportKeysErrors.KeyForPlatformExists());
      }
    }

    const keyValueOrError = KeyValue.create(value);
    const statusOrError = KeyStatus.create();
    const availabilityOrError = KeyAvailability.create();
    const valueObjectResult = Result.combine([keyValueOrError, statusOrError, availabilityOrError]);

    if (valueObjectResult.isErr()) {
      return Result.fail(valueObjectResult.error);
    }

    const keyValue = keyValueOrError.value;
    const status = statusOrError.value;
    const availability = availabilityOrError.value;
    const keyOrError = Key.create({
      value: keyValue,
      product: productId,
      status,
      availability,
      _id: uuidv7(),
    });

    if (keyOrError.error) {
      return Result.fail(new UseCaseErrors.DomainValidation(keyOrError.error.message));
    }

    const key = keyOrError.value;
    const addResult = product.addKey(key._id);

    if (addResult.error) {
      return Result.fail(new UseCaseErrors.DomainValidation(addResult.error.message));
    }

    this.keyCommandsRepo.save(key);
    this.productCommandsRepo.save(product);

    return Result.ok();
  };

  execute = async (request: ImportKeysRequestDto): Promise<Response> => {
    const { keysFile } = request;
    const keysItems = JSON.parse(keysFile.buffer.toString());

    try {
      const results = await Promise.all(
        keysItems.map((item) => item.keys.map((key) => this.createKey(item.productId, key))),
      );

      const combinedResults = Result.combine(results);

      if (combinedResults.isErr()) {
        return Result.fail(combinedResults.error);
      }

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
