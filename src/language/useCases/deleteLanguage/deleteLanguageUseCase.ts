import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { LanguageRepoI } from '../../languageRepo';
import { DeleteLanguageRequestDto } from './deleteLanguageRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DeleteLanguageUseCase implements UseCase<DeleteLanguageRequestDto, Response> {
  constructor(private languageRepo: LanguageRepoI) {}

  execute = async (request: DeleteLanguageRequestDto): Promise<Response> => {
    const { languageId } = request;

    try {
      const language = await this.languageRepo.getLanguage(languageId);
      const found = !!language;

      if (!found) {
        return left(new AppError.NotFound('Language not found'));
      }

      await this.languageRepo.deleteLanguage(languageId);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
