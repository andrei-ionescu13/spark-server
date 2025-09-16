import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { LanguageCommandsRepoI } from '../../repo/commands';
import { LanguageQueriesRepoI } from '../../repo/queries';
import { DeleteLanguagesBulkRequestDto } from './deleteLanguagesBulkRequestDto';

type Response = Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class DeleteLanguagesBulkUseCase
  implements UseCase<DeleteLanguagesBulkRequestDto, Response>
{
  constructor(
    private languageCommandsRepo: LanguageCommandsRepoI,
    private languageQueriesRepo: LanguageQueriesRepoI,
  ) {}

  deleteLanguage = async (
    languageId: string,
  ): Promise<Result<undefined, UseCaseErrors.NotFound>> => {
    const language = await this.languageQueriesRepo.getLanguage(languageId);
    if (!language) {
      return Result.fail(new UseCaseErrors.NotFound('Language not found'));
    }

    await this.languageCommandsRepo.deleteLanguage(languageId);
    return Result.ok();
  };

  execute = async (request: DeleteLanguagesBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      const responses = await Promise.all(ids.map((id) => this.deleteLanguage(id)));
      const combinedResult = Result.combine(responses);

      if (combinedResult.isErr()) {
        return Result.fail(combinedResult.error);
      }

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
