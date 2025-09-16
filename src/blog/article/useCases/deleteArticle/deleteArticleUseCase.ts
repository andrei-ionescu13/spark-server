import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { ArticleCommandRepoI } from '../../repo/commands';
import { DeleteArticleRequestDto } from './deleteArticleRequestDto';

type Response = Result<void, UseCaseErrors.UnexpectedError>;

export class DeleteArticleUseCase implements UseCase<DeleteArticleRequestDto, Response> {
  constructor(private articleCommandRepo: ArticleCommandRepoI) {}

  execute = async (request: DeleteArticleRequestDto): Promise<Response> => {
    const { articleId } = request;

    try {
      await this.articleCommandRepo.deleteArticle(articleId);
      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
