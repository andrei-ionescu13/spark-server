import { UseCaseErrors } from '../../../src/AppError';
import { Either, Result, left, right } from '../../../src/Result';
import { UploaderService } from '../../../src/services/uploaderService';
import { UseCase } from '../../../src/use-case';
import { DealRepoI } from '../../dealRepo';
import { DeleteDealRequestDto } from './deleteDealRequestDto';

type Response = Either<UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound, Result<any>>;

export class DeleteDealUseCase implements UseCase<DeleteDealRequestDto, Response> {
  constructor(private dealRepo: DealRepoI, private uplouaderService: UploaderService) {}

  execute = async (request: DeleteDealRequestDto): Promise<Response> => {
    const { dealId } = request;

    try {
      const deal = await this.dealRepo.getDeal(dealId);
      const found = !!deal;

      if (!found) {
        return left(new UseCaseErrors.NotFound('Deal not found'));
      }

      await this.dealRepo.deleteDeal(dealId);
      await this.uplouaderService.delete(deal.cover.public_id);

      return right(Result.ok<any>(deal));
    } catch (error) {
      console.log(error);
      return left(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
