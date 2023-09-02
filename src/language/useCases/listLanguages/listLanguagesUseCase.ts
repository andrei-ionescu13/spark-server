import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { LanguageRepoI } from '../../languageRepo';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class ListLanguagesUseCase implements UseCase<undefined, Response> {
  constructor(private languageRepo: LanguageRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const Languages = await this.languageRepo.listLanguages();
      console.log(Languages);
      return right(Result.ok<any>(Languages));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
