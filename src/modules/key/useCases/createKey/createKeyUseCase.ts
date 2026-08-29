import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../../AppError';
import { ProductCommandsRepoI } from '../../../product/repo/commands';
import { ProductQueriesRepoI } from '../../../product/repo/queries';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { UseCaseError } from '../../../../UseCaseError';
import { Key } from '../../key';
import { KeyAvailability } from '../../keyAvailability';
import { KeyStatus } from '../../keyStatus';
import { KeyValue } from '../../keyValue';
import { KeyCommandsRepoI } from '../../repo/commands';
import { KeyQueriesRepoI } from '../../repo/queries';
import { CreateKeyRequestDto } from './createKeyRequestDto';

export namespace CreateKeyErrors {
  export class KeyForPlatformExists extends UseCaseError {
    constructor(productId: string, platform: string) {
      super(`Key for ${productId} exists for the ${platform} platform`);
    }
  }
}

type Response = Result<
  string,
  CreateKeyErrors.KeyForPlatformExists | UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound
>;

export class CreateKeyUseCase implements UseCase<CreateKeyRequestDto, Response> {
  constructor(
    private keyCommandsRepo: KeyCommandsRepoI,
    private keyQueriesRepo: KeyQueriesRepoI,
    private productCommandsRepo: ProductCommandsRepoI,
    private productQueriesRepo: ProductQueriesRepoI,
  ) {}

  execute = async (request: CreateKeyRequestDto): Promise<Response> => {
    const { productId, value } = request;

    try {
      const productOrError = await this.productCommandsRepo.getProduct(productId);
      if (productOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(productOrError.error.message));
      }

      const product = productOrError.value;
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      const keyFound = await this.keyQueriesRepo.getKeyByValue(value);
      if (keyFound) {
        const productsByKeyFound = await this.productQueriesRepo.searchProductsByKeys(value);
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
          return Result.fail(
            new CreateKeyErrors.KeyForPlatformExists(productId, samePlatform.name),
          );
        }
      }

      const valueOrError = KeyValue.create(value);
      const availabilityOrError = KeyAvailability.create();
      const statusOrError = KeyStatus.create();
      const result = Result.combine([valueOrError, availabilityOrError, statusOrError]);
      if (result.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(result.error.message));
      }

      const keyValue = valueOrError.value;
      const availability = availabilityOrError.value;
      const status = statusOrError.value;

      const keyOrError = Key.create({
        product: productId,
        value: keyValue,
        availability,
        status,
        _id: uuidv7(),
      });

      if (keyOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(keyOrError.error.message));
      }

      const key = keyOrError.value;

      const addResult = product.addKey(key._id);
      if (addResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(addResult.error.message));
      }

      await this.keyCommandsRepo.save(key);
      await this.productCommandsRepo.save(product);

      return Result.ok(key._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
