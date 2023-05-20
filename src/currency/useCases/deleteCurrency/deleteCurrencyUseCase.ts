import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { CurrencyRepoI } from '../../currencyRepo';
import { DeleteCurrencyRequestDto } from './deleteCurrencyRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DeleteCurrencyUseCase implements UseCase<DeleteCurrencyRequestDto, Response> {
  constructor(private currencyRepo: CurrencyRepoI) {}

  execute = async (request: DeleteCurrencyRequestDto): Promise<Response> => {
    const { currencyId } = request;

    try {
      const currency = await this.currencyRepo.getCurrency(currencyId);

      if (!currency) {
        return left(new AppError.NotFound('Currency not found'));
      }

      await this.currencyRepo.deleteCurrency(currencyId);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
