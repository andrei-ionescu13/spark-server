import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { DealRepoI } from '../../dealRepo';
import { DeleteDealRequestDto } from './deleteDealRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DeleteDealUseCase implements UseCase<DeleteDealRequestDto, Response> {
  constructor(private dealRepo: DealRepoI, private uplouaderService: UploaderService) {}

  execute = async (request: DeleteDealRequestDto): Promise<Response> => {
    const { dealId } = request;

    try {
      const deal = await this.dealRepo.getDeal(dealId);
      const found = !!deal;

      if (!found) {
        return left(new AppError.NotFound('Deal not found'));
      }

      await this.dealRepo.deleteDeal(dealId);
      await this.uplouaderService.delete(deal.cover.public_id);

      return right(Result.ok<any>(deal));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
