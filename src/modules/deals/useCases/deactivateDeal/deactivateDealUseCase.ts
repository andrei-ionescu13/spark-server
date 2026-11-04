import { UseCaseErrors } from '../../../../appErrors';
import { DomainValidationError } from '../../../blog/article/domain/status';
import { Result } from '../../../../results';
import { UseCase } from '../../../../useCase';
import { Deal } from '../../domain/deal';
import { DealCommandsRepoI } from '../../repo/commands';
import { DeactivateDealRequestDto } from './deactivateRequestDto';

type Response = Result<Deal, UseCaseErrors.UnexpectedError>;

export class DeactivateDealUseCase implements UseCase<DeactivateDealRequestDto, Response> {
  constructor(private dealCommandsRepo: DealCommandsRepoI) {}

  execute = async (request: DeactivateDealRequestDto): Promise<Response> => {
    const { dealId } = request;

    try {
      const deal = await this.dealCommandsRepo.getDeal(dealId);
      if (!deal) {
        return Result.fail(new UseCaseErrors.NotFound('Deal not found'));
      }

      deal.deactivate();
      await this.dealCommandsRepo.save(deal);

      return Result.ok(deal);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
