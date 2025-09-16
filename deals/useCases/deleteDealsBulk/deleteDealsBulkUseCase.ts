import { UseCaseErrors } from '../../../src/AppError';
import { Either, Result, left, right } from '../../../src/Result';
import { UploaderService } from '../../../src/services/uploaderService';
import { UseCase } from '../../../src/use-case';
import { DealRepoI } from '../../dealRepo';
import { DeleteDealsBulkRequestDto } from './deleteDealsBulkRequestDto';

type Response = Either<UseCaseErrors.UnexpectedError, Result<any>>;

export class DeleteDealsBulkUseCase implements UseCase<DeleteDealsBulkRequestDto, Response> {
  constructor(private dealRepo: DealRepoI, private uplouaderService: UploaderService) {}

  deleteDeal = async (dealId) => {
    const deal = await this.dealRepo.getDeal(dealId);
    const found = !!deal;

    if (!found) {
      return left(new UseCaseErrors.NotFound('Deal not found'));
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
      return left(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
