import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { DealRepoI } from '../../dealRepo';
import { GetDealRequestDto } from './getDealRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class GetDealUseCase implements UseCase<GetDealRequestDto, Response> {
  constructor(private dealRepo: DealRepoI) {}

  execute = async (request: GetDealRequestDto): Promise<Response> => {
    const { dealId } = request;

    try {
      const deal = await this.dealRepo.getDeal(dealId);
      const found = !!deal;

      if (!found) {
        return left(new AppError.NotFound('Deal not found'));
      }

      return right(Result.ok<any>(deal));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
