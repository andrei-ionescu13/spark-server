import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { UseCase } from '../../../use-case';
import { TranslationsLanguageRepoI } from '../../languageRepo';
import { AddTranslationsLanguageRequestDto } from './addTranslationsLanguageRequestDto';

export namespace AddTranslationsLanguageErrors {
  export class TranslationsLanguageExistsError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'TranslationsLanguage already exists' });
    }
  }
}

type Response = Either<
  AppError.UnexpectedError | AddTranslationsLanguageErrors.TranslationsLanguageExistsError,
  Result<any>
>;

export class AddTranslationsLanguageUseCase
  implements UseCase<AddTranslationsLanguageRequestDto, Response>
{
  constructor(private translationsLanguageRepo: TranslationsLanguageRepoI) {}

  execute = async (request: AddTranslationsLanguageRequestDto): Promise<Response> => {
    const props = request;

    try {
      let translationsLanguage = await this.translationsLanguageRepo.getTranslationsLanguageByCode(
        props.code,
      );
      const found = !!translationsLanguage;

      if (found) {
        return left(new AddTranslationsLanguageErrors.TranslationsLanguageExistsError());
      }

      translationsLanguage = await this.translationsLanguageRepo.createTranslationsLanguage(props);
      return right(Result.ok<any>(translationsLanguage));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
