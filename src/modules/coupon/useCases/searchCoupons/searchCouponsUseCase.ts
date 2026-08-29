import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { CouponDto } from '../../couponMapper';
import { CouponQueriesRepoI } from '../../repo/queries';
import { SearchCouponsRequestDto } from './searchCouponsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<{ coupons: CouponDto[]; count: number }, UseCaseErrors.UnexpectedError>;

export class SearchCouponsUseCase implements UseCase<SearchCouponsRequestDto, Response> {
  constructor(private couponQueriesRepo: CouponQueriesRepoI) {}

  execute = async (request: SearchCouponsRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const { coupons, count } = await this.couponQueriesRepo.searchCoupons(query);

      return Result.ok({ coupons, count });
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
