import { UseCaseErrors } from '../../../../appErrors';
import { Result } from '../../../../results';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../useCase';
import { CollectionDto } from '../../collectionMapper';
import { CollectionCommandsRepoI } from '../../repo/commands';
import { CollectionQueriesRepoI } from '../../repo/queries';
import { DeleteCollectionRequestDto } from './deleteCollectionRequestDto';

type Response = Result<string, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class DeleteCollectionUseCase implements UseCase<DeleteCollectionRequestDto, Response> {
  constructor(
    private collectionCommandsRepo: CollectionCommandsRepoI,
    private collectionQueriesRepo: CollectionQueriesRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: DeleteCollectionRequestDto): Promise<Response> => {
    const { collectionId } = request;

    try {
      const collection = await this.collectionQueriesRepo.getCollection(collectionId);
      if (!collection) {
        return Result.fail(new UseCaseErrors.NotFound('Collection not found'));
      }

      await this.collectionCommandsRepo.deleteCollection(collectionId);
      await this.uploaderService.delete(collection.cover.publicId);

      return Result.ok(collection._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
