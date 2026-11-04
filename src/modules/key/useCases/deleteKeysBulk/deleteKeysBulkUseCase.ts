import { UseCaseErrors } from '../../../../appErrors';
import { ProductCommandsRepoI } from '../../../product/repo/commands';
import { Result } from '../../../../results';
import { UseCase } from '../../../../useCase';
import { KeyCommandsRepoI } from '../../repo/commands';
import { KeyQueriesRepoI } from '../../repo/queries';
import { DeleteKeysBulkRequestDto } from './deleteKeysBulkRequestDto';

type Response = Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.DomainValidation>;

export class DeleteKeysBulkUseCase implements UseCase<DeleteKeysBulkRequestDto, Response> {
  constructor(
    private keyCommandsRepo: KeyCommandsRepoI,
    private keyQueriesRepo: KeyQueriesRepoI,
    private productCommandsRepo: ProductCommandsRepoI,
  ) {}

  deleteKey = async (
    keyId: string,
  ): Promise<Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.DomainValidation>> => {
    const key = await this.keyQueriesRepo.getKey(keyId);
    if (!key) {
      return Result.fail(new UseCaseErrors.NotFound('Key not found'));
    }

    const product = await this.productCommandsRepo.getProductByKey(keyId);
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
  };

  execute = async (request: DeleteKeysBulkRequestDto): Promise<Response> => {
    const { keyIds } = request;

    try {
      const results = await Promise.all(keyIds.map((id) => this.deleteKey(id)));
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
