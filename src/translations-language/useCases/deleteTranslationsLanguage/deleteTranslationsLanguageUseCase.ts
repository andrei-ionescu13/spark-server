import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { TranslationsLanguageRepoI } from '../../languageRepo';
import { DeleteTranslationsLanguageRequestDto } from './deleteTranslationsLanguageRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DeleteTranslationsLanguageUseCase
  implements UseCase<DeleteTranslationsLanguageRequestDto, Response>
{
  constructor(private translationsLanguageRepo: TranslationsLanguageRepoI) {}

  execute = async (request: DeleteTranslationsLanguageRequestDto): Promise<Response> => {
    const { translationsLanguageId } = request;

    try {
      const translationsLanguage = await this.translationsLanguageRepo.getTranslationsLanguage(
        translationsLanguageId,
      );
      const found = !!translationsLanguage;

      if (!found) {
        return left(new AppError.NotFound('TranslationsLanguage not found'));
      }

      await this.translationsLanguageRepo.deleteTranslationsLanguage(translationsLanguageId);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
