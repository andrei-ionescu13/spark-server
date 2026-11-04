import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../../appErrors';
import { ProductCommandsRepoI } from '../../../product/repo/commands';
import { ProductQueriesRepoI } from '../../../product/repo/queries';
import { Result } from '../../../../results';
import { UseCase } from '../../../../useCase';
import { UseCaseError } from '../../../../useCaseErrors';
import { Key } from '../../domain/key';
import { KeyAvailability } from '../../domain/keyAvailability';
import { KeyStatus } from '../../domain/keyStatus';
import { KeyValue } from '../../domain/keyValue';
import { KeyCommandsRepoI } from '../../repo/commands';
import { KeyQueriesRepoI } from '../../repo/queries';
import { CreateKeyRequestDto } from './createKeyRequestDto';
import { ProductKeyCreationChecker } from '../../../../productKeyCreationChecker';

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
    private productCommandsRepo: ProductCommandsRepoI,
    private keyCommandsRepo: KeyCommandsRepoI,
    private productKeyCreationChecker: ProductKeyCreationChecker,
  ) {}

  execute = async (request: CreateKeyRequestDto): Promise<Response> => {
    const { productId, value } = request;

    try {
      const product = await this.productCommandsRepo.getProduct(productId);
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      const canCreateResult = await this.productKeyCreationChecker.checkCanCreate(product, value);
      if (canCreateResult.isErr()) {
        return Result.fail(canCreateResult.error);
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
