import { UseCaseErrors } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { CollectionRepoI } from '../../collectionRepo';
import { GetCollectionRequestDto } from './getCollectionRequestDto';

type Response = Either<UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound, Result<any>>;

export class GetCollectionUseCase implements UseCase<GetCollectionRequestDto, Response> {
  constructor(private collectionRepo: CollectionRepoI) {}

  execute = async (request: GetCollectionRequestDto): Promise<Response> => {
    const { collectionId } = request;

    try {
      const collection = await this.collectionRepo.getCollection(collectionId);
      const found = !!collection;

      if (!found) {
        return left(new UseCaseErrors.NotFound('Collection not found'));
      }

      return right(Result.ok<any>(collection));
    } catch (error) {
      console.log(error);
      return left(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
