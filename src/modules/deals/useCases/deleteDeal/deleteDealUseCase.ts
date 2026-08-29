import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../useCase';
import { Deal } from '../../deal';
import { DealDto } from '../../dealMapper';
import { DealCommandsRepoI } from '../../repo/commands';
import { DealQueriesRepoI } from '../../repo/queries';
import { DeleteDealRequestDto } from './deleteDealRequestDto';

type Response = Result<DealDto, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class DeleteDealUseCase implements UseCase<DeleteDealRequestDto, Response> {
  constructor(
    private dealCommandsRepo: DealCommandsRepoI,
    private dealQueriesRepo: DealQueriesRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: DeleteDealRequestDto): Promise<Response> => {
    const { dealId } = request;

    try {
      const deal = await this.dealQueriesRepo.getDeal(dealId);

      if (!deal) {
        return Result.fail(new UseCaseErrors.NotFound('Deal not found'));
      }

      await this.dealCommandsRepo.deleteDeal(dealId);
      await this.uploaderService.delete(deal.cover.publicId);

      return Result.ok(deal);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
