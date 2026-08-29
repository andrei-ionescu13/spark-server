import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { ArticleCommandsRepoI } from '../../repo/commands';
import { UpdateArticleStatusRequestDto } from './updateArticleStatusRequestDto';

type Response = Result<string, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateArticleStatusUseCase
  implements UseCase<UpdateArticleStatusRequestDto, Response>
{
  constructor(private articleCommandsRepo: ArticleCommandsRepoI) {}

  execute = async (request: UpdateArticleStatusRequestDto): Promise<Response> => {
    const { articleId, status } = request;

    try {
      const articleOrError = await this.articleCommandsRepo.getArticle(articleId);

      if (articleOrError.isErr()) {
        return Result.fail(new UseCaseErrors.ValidationError(articleOrError.error.message));
      }

      const article = articleOrError.value;

      if (!article) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      const updatedArticleOrError = await this.articleCommandsRepo.updateArticle(articleId, {
        status,
      });

      if (updatedArticleOrError.isErr()) {
        return Result.fail(new UseCaseErrors.ValidationError(updatedArticleOrError.error.message));
      }

      const updatedArticle = updatedArticleOrError.value;

      if (!updatedArticle) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      return Result.ok(updatedArticle.status.value);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
