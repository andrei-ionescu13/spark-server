import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UseCaseError } from '../../../UseCaseError';
import { CurrencyRepoI } from '../../currencyRepo';
import { AddCurrencyRequestDto } from './addCurrencyRequestDto';

export namespace AddCurrencyErrors {
  export class TitleNotAvailableError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Currency already exists' });
    }
  }
}

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class AddCurrencyUseCase implements UseCase<AddCurrencyRequestDto, Response> {
  constructor(private currencyRepo: CurrencyRepoI) {}

  execute = async (request: AddCurrencyRequestDto): Promise<Response> => {
    const props = request;

    try {
      const currencyFound = await this.currencyRepo.getCurrencyByCode(props.code);

      if (!!currencyFound) {
        return left(new AddCurrencyErrors.TitleNotAvailableError());
      }

      const currency = await this.currencyRepo.createCurrency(props);

      return right(Result.ok<any>(currency));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
