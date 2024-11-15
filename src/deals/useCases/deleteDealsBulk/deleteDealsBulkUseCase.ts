import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { DealRepoI } from '../../dealRepo';
import { DeleteDealsBulkRequestDto } from './deleteDealsBulkRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteDealsBulkUseCase implements UseCase<DeleteDealsBulkRequestDto, Response> {
  constructor(private dealRepo: DealRepoI, private uplouaderService: UploaderService) {}

  deleteDeal = async (dealId) => {
    const deal = await this.dealRepo.getDeal(dealId);
    const found = !!deal;

    if (!found) {
      return left(new AppError.NotFound('Deal not found'));
    }

    await this.dealRepo.deleteDeal(dealId);
    await this.uplouaderService.delete(deal.cover.public_id);

    return deal;
  };

  execute = async (request: DeleteDealsBulkRequestDto): Promise<Response> => {
    const { ids } = request;
    try {
      await Promise.all(ids.map((id) => this.deleteDeal(id)));

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
