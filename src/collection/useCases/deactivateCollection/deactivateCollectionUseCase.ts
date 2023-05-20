import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { CollectionRepoI } from '../../collectionRepo';
import { DeactivateCollectionRequestDto } from './deactivateCollectionRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DeactivateCollectionUseCase
  implements UseCase<DeactivateCollectionRequestDto, Response>
{
  constructor(private collectionRepo: CollectionRepoI) {}

  execute = async (request: DeactivateCollectionRequestDto): Promise<Response> => {
    const { collectionId } = request;

    try {
      const collection = await this.collectionRepo.getCollection(collectionId);
      const found = !!collection;

      if (!found) {
        return left(new AppError.NotFound('Collection not found'));
      }

      await this.collectionRepo.updateCollection(collectionId, { endDate: Date.now() });

      return right(Result.ok(collection));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
