import { AppError } from '../../../AppError';
import { Either, Result, right, left } from '../../../Result';
import { UseCase } from '../../../use-case';
import { CollectionRepoI } from '../../collectionRepo';
import { SearchCollectionsRequestDto } from './searchCollectionsRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

const MAX_LIMIT = 36;
const LIMIT = 12;

export class SearchCollectionsUseCase implements UseCase<SearchCollectionsRequestDto, Response> {
  constructor(private collectionRepo: CollectionRepoI) {}

  execute = async (request: SearchCollectionsRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const collections = await this.collectionRepo.searchCollections(query);
      const count = await this.collectionRepo.getCollectionsCount(query);

      return right(Result.ok<any>({ collections, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
