import { UseCaseErrors } from '../../../../appErrors';
import { Result } from '../../../../results';
import { UseCase } from '../../../../useCase';
import { Collection } from '../../domain/collection';
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
      const collection = await this.collectionCommandsRepo.getCollection(collectionId);
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
