import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { ArticleCommandsRepoI } from '../../repo/commands';
import { DeleteArticlesBulkRequestDto } from './deleteArticlesBulkRequestDto';

type Response = Result<void, UseCaseErrors.UnexpectedError>;

export class DeleteArticlesBulkUseCase implements UseCase<DeleteArticlesBulkRequestDto, Response> {
  constructor(private articleCommandsRepo: ArticleCommandsRepoI) {}

  execute = async (request: DeleteArticlesBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      await Promise.all(ids.map((id) => this.articleCommandsRepo.deleteArticle(id)));

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
