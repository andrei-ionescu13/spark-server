import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { PublisherDto } from '../../publisherMapper';
import { PublisherQueriesRepoI } from '../../repo/queries';
import { SearchPublishersRequestDto } from './searchPublishersRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<
  { publishers: PublisherDto[]; count: number },
  UseCaseErrors.UnexpectedError
>;

export class SearchPublishersUseCase implements UseCase<SearchPublishersRequestDto, Response> {
  constructor(private publisherQueriesRepo: PublisherQueriesRepoI) {}

  execute = async (request: SearchPublishersRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const searchResult = await this.publisherQueriesRepo.searchPublishers(query);
      return Result.ok(searchResult);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
