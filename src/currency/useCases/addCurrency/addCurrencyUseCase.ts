import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { CurrencyRepoI } from '../../currencyRepo';
import { AddCurrencyRequestDto } from './addCurrencyRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class AddCurrencyUseCase implements UseCase<AddCurrencyRequestDto, Response> {
  constructor(private currencyRepo: CurrencyRepoI) {}

  execute = async (request: AddCurrencyRequestDto): Promise<Response> => {
    const props = request;

    try {
      const currency = await this.currencyRepo.createCurrency(props);

      return right(Result.ok<any>(currency));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
