import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { DealCommandsRepoI } from '../../repo/commands';
import { DealQueriesRepoI } from '../../repo/queries';
import { DeleteDealsBulkRequestDto } from './deleteDealsBulkRequestDto';

type Response = Result<void, UseCaseErrors.UnexpectedError>;

export class DeleteDealsBulkUseCase implements UseCase<DeleteDealsBulkRequestDto, Response> {
  constructor(
    private dealCommandsRepo: DealCommandsRepoI,
    private dealQueriesRepo: DealQueriesRepoI,
    private uplouaderService: UploaderService,
  ) {}

  deleteDeal = async (id: string) => {
    const deal = await this.dealQueriesRepo.getDeal(id);

    if (!deal) {
      return Result.fail(new UseCaseErrors.NotFound('Deal not found'));
    }

    await Promise.all([
      await this.dealCommandsRepo.deleteDeal(id),
      await this.uplouaderService.delete(deal.cover.publicId),
    ]);

    return deal;
  };

  execute = async (request: DeleteDealsBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      await Promise.all(ids.map((id) => this.deleteDeal(id)));

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
