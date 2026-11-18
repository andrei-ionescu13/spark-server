import { UseCaseErrors } from '../../../../../appError';
import { Result } from '../../../../../result';
import { UseCase } from '../../../../../useCase';
import { LanguageDto } from '../../languageMapper';
import { LanguageQueriesRepoI } from '../../repo/queries';

type Response = Result<LanguageDto[], UseCaseErrors.UnexpectedError>;

export class ListLanguagesUseCase implements UseCase<undefined, Response> {
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
