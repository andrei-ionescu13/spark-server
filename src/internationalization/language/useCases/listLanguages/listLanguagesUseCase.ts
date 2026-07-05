import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { LanguageDto } from '../../languageMapper';
import { LanguageQueriesRepoI } from '../../repo/queries';
import { ListLanguagesRequestDto } from './listLanguagesRequestDto';

type Response = Result<LanguageDto[], UseCaseErrors.UnexpectedError>;

export class ListLanguagesUseCase implements UseCase<ListLanguagesRequestDto, Response> {
  constructor(private languageQueriesRepo: LanguageQueriesRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const searchResult = await this.languageQueriesRepo.listLanguages();
      return Result.ok(searchResult);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
