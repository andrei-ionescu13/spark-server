import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { UseCaseError } from '../../../../UseCaseError';
import { Key } from '../../../key/key';
import { KeyAvailability } from '../../../key/keyAvailability';
import { KeyStatus } from '../../../key/keyStatus';
import { KeyValue } from '../../../key/keyValue';
import { KeyCommandsRepoI } from '../../../key/repo/commands';
import { KeyQueriesRepoI } from '../../../key/repo/queries';
import { ProductCommandsRepoI } from '../../repo/commands';
import { ProductQueriesRepoI } from '../../repo/queries';
import { ImportProductKeysRequestDto } from './importProductKeysRequestDto';
import { v7 as uuid7 } from 'uuid';

export namespace ImportProductKeysErrors {
  export class KeyForPlatformExists extends UseCaseError {
    constructor() {
      super('One or more keys could not be added');
    }
  }
}

type Response = Result<
  void,
  ImportProductKeysErrors.KeyForPlatformExists | UseCaseErrors.UnexpectedError
>;

export class ImportProductKeysUseCase implements UseCase<ImportProductKeysRequestDto, Response> {
  constructor(
    private keyCommandsRepo: KeyCommandsRepoI,
    private keyQueriesRepo: KeyQueriesRepoI,
    private productCommandsRepoI: ProductCommandsRepoI,
    private productQueriesRepo: ProductQueriesRepoI,
  ) {}

  createKey = async (
    productId: string,
    platformId: string,
    value: string,
  ): Promise<
    Result<
      void,
      | UseCaseErrors.NotFound
      | UseCaseErrors.DomainValidation
      | ImportProductKeysErrors.KeyForPlatformExists
    >
  > => {
    const product = await this.productQueriesRepo.getProduct(productId);
    if (!product) {
      return Result.fail(new UseCaseErrors.NotFound('Product not found'));
    }
    const existingKey = await this.keyQueriesRepo.getKeyByValueAndPlatform(value, platformId);

    if (existingKey) {
      return Result.fail(new ImportProductKeysErrors.KeyForPlatformExists());
    }

    const availabilityOrError = KeyAvailability.create('available');
    const statusOrError = KeyStatus.create('secret');
    const valueOrError = KeyValue.create(value);
    const combinedResult = Result.combine([availabilityOrError, statusOrError, valueOrError]);

    if (combinedResult.isErr())
      return Result.fail(new UseCaseErrors.DomainValidation(combinedResult.error.message));

    const keyAvailability = availabilityOrError.value;
    const keyStatus = statusOrError.value;
    const keyValue = valueOrError.value;
    const keyOrError = Key.create({
      _id: uuid7(),
      availability: keyAvailability,
      product: productId,
      status: keyStatus,
      value: keyValue,
    });

    if (keyOrError.isErr())
      return Result.fail(new UseCaseErrors.DomainValidation(keyOrError.error.message));

    const key = keyOrError.value;
    await this.keyCommandsRepo.save(key);
    await this.productCommandsRepoI.addProductKey(productId, key._id);

    return Result.ok();
  };

  execute = async (request: ImportProductKeysRequestDto): Promise<Response> => {
    const { file, productId } = request;
    const fileContent = file.buffer.toString();
    const fileKeys: Array<{ value: string; platform: string }> = JSON.parse(fileContent);

    try {
      const results = await Promise.all(
        fileKeys.map((key) => this.createKey(productId, key.platform, key.value)),
      );
      const combinedResult = Result.combine(results);
      if (combinedResult.isErr()) return Result.fail(combinedResult.error);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
