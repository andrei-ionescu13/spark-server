import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../useCase';
import { CollectionCommandsRepoI } from '../../repo/commands';
import { CollectionQueriesRepoI } from '../../repo/queries';
import { DeleteCollectionsBulkRequestDto } from './deleteCollectionsBulkRequestDto';

type Response = Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class DeleteCollectionsBulkUseCase
  implements UseCase<DeleteCollectionsBulkRequestDto, Response>
{
  constructor(
    private collectionCommandsRepo: CollectionCommandsRepoI,
    private collectionQueriesRepo: CollectionQueriesRepoI,
    private uploaderService: UploaderService,
  ) {}

  deleteCollection = async (
    collectionId: string,
  ): Promise<Result<undefined, UseCaseErrors.NotFound>> => {
    const collection = await this.collectionQueriesRepo.getCollection(collectionId);
    const found = !!collection;

    if (!found) {
      return Result.fail(new UseCaseErrors.NotFound('Collection not found'));
    }

    await this.collectionCommandsRepo.deleteCollection(collectionId);
    await this.uploaderService.delete(collection.cover.publicId);

    return Result.ok();
  };

  execute = async (request: DeleteCollectionsBulkRequestDto): Promise<Response> => {
    const { ids } = request;
    try {
      const deletionResults = Result.combine(
        await Promise.all(ids.map((id) => this.deleteCollection(id))),
      );

      if (deletionResults.isErr()) {
        return Result.fail(deletionResults.error);
      }

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
