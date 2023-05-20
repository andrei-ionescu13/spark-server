import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { UseCase } from '../../../use-case';
import { LanguageRepoI } from '../../languageRepo';
import { AddLanguageRequestDto } from './addLanguageRequestDto';

export namespace AddLanguageErrors {
  export class LanguageExistsError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Language already exists' });
    }
  }
}

type Response = Either<
  AppError.UnexpectedError | AddLanguageErrors.LanguageExistsError,
  Result<any>
>;

export class AddLanguageUseCase implements UseCase<AddLanguageRequestDto, Response> {
  constructor(private languageRepo: LanguageRepoI) {}

  execute = async (request: AddLanguageRequestDto): Promise<Response> => {
    const props = request;

    try {
      let language = await this.languageRepo.getLanguageByCode(props.code);
      const found = !!language;

      if (found) {
        return left(new AddLanguageErrors.LanguageExistsError());
      }

      language = await this.languageRepo.createLanguage(props);
      return right(Result.ok<any>(language));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
