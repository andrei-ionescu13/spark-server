import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { PublisherRepoI } from '../../publisherRepo';
import { SearchPublishersRequestDto } from './searchPublishersRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchPublishersUseCase implements UseCase<SearchPublishersRequestDto, Response> {
  constructor(private publisherRepo: PublisherRepoI) {}

  execute = async (request: SearchPublishersRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const publishersAndCount = await this.publisherRepo.searchPublishers(query);

      return right(Result.ok<any>(publishersAndCount));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
