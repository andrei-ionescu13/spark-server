import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { CouponRepoI } from '../../couponRepo';
import { SearchCouponsRequestDto } from './searchCouponsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 12;

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchCouponsUseCase implements UseCase<SearchCouponsRequestDto, Response> {
  constructor(private couponRepo: CouponRepoI) {}

  execute = async (request: SearchCouponsRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const promoCodes = await this.couponRepo.searchCoupons(query);
      const count = await this.couponRepo.getCouponsCount(query);

      return right(Result.ok<any>({ promoCodes, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
