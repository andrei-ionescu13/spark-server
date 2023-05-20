import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { KeyRepoI } from '../../keyRepo';
import { SearchKeysRequestDto } from './searchKeysRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 12;

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchKeysUseCase implements UseCase<SearchKeysRequestDto, Response> {
  constructor(private keyRepo: KeyRepoI) {}

  execute = async (request: SearchKeysRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const keys = await this.keyRepo.searchKeys(query);
      const count = await this.keyRepo.getKeysCount(query);

      return right(Result.ok<any>({ keys, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
