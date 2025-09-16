import { UseCaseErrors } from '../../../src/AppError';
import { Either, Result, left, right } from '../../../src/Result';
import { UseCase } from '../../../src/use-case';
import { DealRepoI } from '../../dealRepo';
import { GetDealRequestDto } from './getDealRequestDto';

type Response = Either<UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound, Result<any>>;

export class GetDealUseCase implements UseCase<GetDealRequestDto, Response> {
  constructor(private dealRepo: DealRepoI) {}

  execute = async (request: GetDealRequestDto): Promise<Response> => {
    const { dealId } = request;

    try {
      const deal = await this.dealRepo.getDeal(dealId);
      const found = !!deal;

      if (!found) {
        return left(new UseCaseErrors.NotFound('Deal not found'));
      }

      return right(Result.ok<any>(deal));
    } catch (error) {
      console.log(error);
      return left(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
