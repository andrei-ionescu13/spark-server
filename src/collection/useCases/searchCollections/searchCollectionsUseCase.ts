import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { CollectionDto } from '../../collectionMapper';
import { CollectionQueriesRepoI } from '../../repo/queries';
import { SearchCollectionsRequestDto } from './searchCollectionsRequestDto';

type Response = Result<
  {
    collections: CollectionDto[];
    count: number;
  },
  UseCaseErrors.UnexpectedError
>;

const MAX_LIMIT = 36;
const LIMIT = 10;

export class SearchCollectionsUseCase implements UseCase<SearchCollectionsRequestDto, Response> {
  constructor(private collectionQueriesRepo: CollectionQueriesRepoI) {}

  execute = async (request: SearchCollectionsRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const searchResult = await this.collectionQueriesRepo.searchCollections(query);
      return Result.ok(searchResult);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
