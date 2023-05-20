import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { CollectionRepoI } from '../../collectionRepo';
import { DeleteCollectionsBulkRequestDto } from './deleteCollectionsBulkRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteCollectionsBulkUseCase
  implements UseCase<DeleteCollectionsBulkRequestDto, Response>
{
  constructor(private collectionRepo: CollectionRepoI, private uplouaderService: UploaderService) {}

  deleteCollection = async (collectionId) => {
    const collection = await this.collectionRepo.getCollection(collectionId);
    const found = !!collection;

    if (!found) {
      return left(new AppError.NotFound('Collection not found'));
    }

    await this.collectionRepo.deleteCollection(collectionId);
    await this.uplouaderService.delete(collection.cover.public_id);

    return collection;
  };

  execute = async (request: DeleteCollectionsBulkRequestDto): Promise<Response> => {
    const { ids } = request;
    try {
      await Promise.all(ids.map((id) => this.deleteCollection(id)));

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
