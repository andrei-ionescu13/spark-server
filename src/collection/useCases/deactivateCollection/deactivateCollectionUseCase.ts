import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { Collection } from '../../collection';
import { CollectionCommandsRepoI } from '../../repo/commands';
import { DeactivateCollectionRequestDto } from './deactivateCollectionRequestDto';

type Response = Result<Collection, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class DeactivateCollectionUseCase
  implements UseCase<DeactivateCollectionRequestDto, Response>
{
  constructor(private collectionCommandsRepo: CollectionCommandsRepoI) {}

  execute = async (request: DeactivateCollectionRequestDto): Promise<Response> => {
    const { collectionId } = request;

    try {
      const collectionOrError = await this.collectionCommandsRepo.getCollection(collectionId);
      if (collectionOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(collectionOrError.error.message));
      }

      const collection = collectionOrError.value;
      if (!collection) {
        return Result.fail(new UseCaseErrors.NotFound('Collection not found'));
      }

      const deactivationResult = collection.deactivate();
      if (deactivationResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(deactivationResult.error.message));
      }

      return Result.ok(collection);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
