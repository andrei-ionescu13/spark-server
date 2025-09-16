import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UseCaseError } from '../../../UseCaseError';
import { Currency } from '../../currency';
import { CurrencyCommandsRepoI } from '../../repo/commands';
import { CurrencyQueriesRepoI } from '../../repo/queries';
import { AddCurrencyRequestDto } from './addCurrencyRequestDto';

export namespace AddCurrencyErrors {
  export class TitleNotAvailableError extends UseCaseError {
    constructor() {
      super('Currency already exists');
    }
  }
}

type Response = Result<
  Currency,
  UseCaseErrors.UnexpectedError | AddCurrencyErrors.TitleNotAvailableError
>;

export class AddCurrencyUseCase implements UseCase<AddCurrencyRequestDto, Response> {
  constructor(
    private currencyCommandsRepo: CurrencyCommandsRepoI,
    private currencyQueriesRepo: CurrencyQueriesRepoI,
  ) {}

  execute = async (request: AddCurrencyRequestDto): Promise<Response> => {
    const props = request;

    try {
      const currencyFound = await this.currencyQueriesRepo.getCurrencyByCode(props.code);
      if (!!currencyFound) {
        return Result.fail(new AddCurrencyErrors.TitleNotAvailableError());
      }

      const currencyOrError = Currency.create({ ...props, _id: uuidv7() });
      if (currencyOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(currencyOrError.error.message));
      }

      const currency = currencyOrError.value;
      await this.currencyCommandsRepo.save(currency);

      return Result.ok(currency);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
