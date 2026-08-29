import { UseCaseErrors } from '../../../../AppError';
import { DomainValidationError } from '../../../blog/article/status';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { Deal } from '../../deal';
import { DealCommandsRepoI } from '../../repo/commands';
import { DeactivateDealRequestDto } from './deactivateRequestDto';

type Response = Result<Deal, UseCaseErrors.UnexpectedError>;

export class DeactivateDealUseCase implements UseCase<DeactivateDealRequestDto, Response> {
  constructor(private dealCommandsRepo: DealCommandsRepoI) {}

  execute = async (request: DeactivateDealRequestDto): Promise<Response> => {
    const { dealId } = request;

    try {
      const dealOrError = await this.dealCommandsRepo.getDeal(dealId);
      if (dealOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(dealOrError.error.message));

      const deal = dealOrError.value;
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
