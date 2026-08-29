import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { CurrencyCommandsRepoI } from '../../repo/commands';
import { CurrencyQueriesRepoI } from '../../repo/queries';
import { DeleteCurrencyRequestDto } from './deleteCurrencyRequestDto';

type Response = Result<undefined, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class DeleteCurrencyUseCase implements UseCase<DeleteCurrencyRequestDto, Response> {
  constructor(
    private currencyCommandsRepo: CurrencyCommandsRepoI,
    private currencyQueriesRepo: CurrencyQueriesRepoI,
  ) {}

  execute = async (request: DeleteCurrencyRequestDto): Promise<Response> => {
    const { currencyId } = request;

    try {
      const currency = await this.currencyQueriesRepo.getCurrency(currencyId);

      if (!currency) {
        return Result.fail(new UseCaseErrors.NotFound('Currency not found'));
      }

      await this.currencyCommandsRepo.deleteCurrency(currencyId);
      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
