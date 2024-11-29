import { AppError } from '../../../AppError';
import { Either, left, Result, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { DealRepoI } from '../../dealRepo';
import { SearchDealsRequestDto } from './searchDealsRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

const MAX_LIMIT = 36;
const LIMIT = 10;

export class SearchDealsUseCase implements UseCase<SearchDealsRequestDto, Response> {
  constructor(private dealRepo: DealRepoI) {}

  execute = async (request: SearchDealsRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const deals = await this.dealRepo.searchDeals(query);
      const count = await this.dealRepo.getDealsCount(query);

      return right(Result.ok<any>({ deals, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
