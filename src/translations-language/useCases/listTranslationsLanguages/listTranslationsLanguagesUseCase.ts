import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { TranslationsLanguageRepoI } from '../../languageRepo';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class ListTranslationsLanguagesUseCase implements UseCase<undefined, Response> {
  constructor(private translationsLanguageRepo: TranslationsLanguageRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const translationsLanguages = await this.translationsLanguageRepo.listTranslationsLanguages();
      return right(Result.ok<any>(translationsLanguages));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
