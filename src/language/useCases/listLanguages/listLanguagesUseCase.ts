import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { LanguageRepoI } from '../../languageRepo';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class ListLanguagesUseCase implements UseCase<undefined, Response> {
  constructor(private languageRepo: LanguageRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const languages = await this.languageRepo.listLanguages();
      return right(Result.ok<any>(languages));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
