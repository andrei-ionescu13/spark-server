import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { CollectionDto } from '../../collectionMapper';
import { CollectionCommandsRepoI } from '../../repo/commands';
import { CollectionQueriesRepoI } from '../../repo/queries';
import { DeleteCollectionRequestDto } from './deleteCollectionRequestDto';

type Response = Result<CollectionDto, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class DeleteCollectionUseCase implements UseCase<DeleteCollectionRequestDto, Response> {
  constructor(
    private collectionCommandsRepo: CollectionCommandsRepoI,
    private collectionQueriesRepo: CollectionQueriesRepoI,
    private uplouaderService: UploaderService,
  ) {}

  execute = async (request: DeleteCollectionRequestDto): Promise<Response> => {
    const { collectionId } = request;

    try {
      const collection = await this.collectionQueriesRepo.getCollection(collectionId);
      if (!collection) {
        return Result.fail(new UseCaseErrors.NotFound('Collection not found'));
      }

      await this.collectionCommandsRepo.deleteCollection(collectionId);
      await this.uplouaderService.delete(collection.cover.publicId);

      return Result.ok(collection);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
