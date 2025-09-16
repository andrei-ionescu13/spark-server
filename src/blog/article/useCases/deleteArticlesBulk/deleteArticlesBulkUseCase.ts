import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { ArticleCommandRepoI } from '../../repo/commands';
import { DeleteArticlesBulkRequestDto } from './deleteArticlesBulkRequestDto';

type Response = Result<void, UseCaseErrors.UnexpectedError>;

export class DeleteArticlesBulkUseCase implements UseCase<DeleteArticlesBulkRequestDto, Response> {
  constructor(private articleCommandRepo: ArticleCommandRepoI) {}

  execute = async (request: DeleteArticlesBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      await Promise.all(ids.map((id) => this.articleCommandRepo.deleteArticle(id)));

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
