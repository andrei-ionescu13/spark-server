import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { LanguageCommandsRepoI } from '../../repo/commands';
import { LanguageQueriesRepoI } from '../../repo/queries';
import { DeleteLanguageRequestDto } from './deleteLanguageRequestDto';

type Response = Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class DeleteLanguageUseCase implements UseCase<DeleteLanguageRequestDto, Response> {
  constructor(
    private languageCommandsRepo: LanguageCommandsRepoI,
    private languageQueriesRepo: LanguageQueriesRepoI,
  ) {}

  execute = async (request: DeleteLanguageRequestDto): Promise<Response> => {
    const { languageId } = request;

    try {
      const language = await this.languageQueriesRepo.getLanguage(languageId);
      if (!language) {
        return Result.fail(new UseCaseErrors.NotFound('Language not found'));
      }

      await this.languageCommandsRepo.deleteLanguage(languageId);
      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
