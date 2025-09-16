import { UseCaseErrors } from '../../../AppError';
import { ProductCommandsRepoI } from '../../../product/repo/commands';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { KeyCommandsRepoI } from '../../repo/commands';
import { KeyQueriesRepoI } from '../../repo/queries';
import { DeleteKeyRequestDto } from './deleteKeyRequestDto';

type Response = Result<undefined, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class DeleteKeyUseCase implements UseCase<DeleteKeyRequestDto, Response> {
  constructor(
    private keyCommandsRepo: KeyCommandsRepoI,
    private keyQueriesRepo: KeyQueriesRepoI,
    private productCommandsRepo: ProductCommandsRepoI,
  ) {}

  execute = async (request: DeleteKeyRequestDto): Promise<Response> => {
    const { keyId } = request;

    try {
      const key = await this.keyQueriesRepo.getKey(keyId);
      const keyFound = !!key;

      if (!keyFound) {
        return Result.fail(new UseCaseErrors.NotFound('Key not found'));
      }

      const productOrError = await this.productCommandsRepo.getProductByKey(keyId);
      if (productOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(productOrError.error.message));
      }

      const product = productOrError.value;
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      const removeResult = product.removeKey(key._id);
      if (removeResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(removeResult.error.message));
      }

      await this.keyCommandsRepo.deleteKey(keyId);
      await this.productCommandsRepo.save(product);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
