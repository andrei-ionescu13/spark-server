import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { CollectionRepoI } from '../../collectionRepo';
import { DeleteCollectionRequestDto } from './deleteCollectionRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DeleteCollectionUseCase implements UseCase<DeleteCollectionRequestDto, Response> {
  constructor(private collectionRepo: CollectionRepoI, private uplouaderService: UploaderService) {}

  execute = async (request: DeleteCollectionRequestDto): Promise<Response> => {
    const { collectionId } = request;

    try {
      const collection = await this.collectionRepo.getCollection(collectionId);
      const found = !!collection;

      if (!found) {
        return left(new AppError.NotFound('Collection not found'));
      }

      await this.collectionRepo.deleteCollection(collectionId);
      await this.uplouaderService.delete(collection.cover.public_id);

      return right(Result.ok<any>(collection));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
