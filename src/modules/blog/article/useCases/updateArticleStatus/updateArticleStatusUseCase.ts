import { UseCaseErrors } from '../../../../../appError';
import { Result } from '../../../../../result';
import { UseCase } from '../../../../../useCase';
import { ArticleStatus } from '../../domain/status';
import { ArticleCommandsRepoI } from '../../repo/commands';
import { UpdateArticleStatusRequestDto } from './updateArticleStatusRequestDto';

type Response = Result<string, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateArticleStatusUseCase
  implements UseCase<UpdateArticleStatusRequestDto, Response>
{
  constructor(private articleCommandsRepo: ArticleCommandsRepoI) {}

  execute = async (request: UpdateArticleStatusRequestDto): Promise<Response> => {
    try {
      const article = await this.articleCommandsRepo.getArticle(request.articleId);
      if (!article) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      const statusOrError = ArticleStatus.create(request.status);
      if (statusOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(statusOrError.error.message));
      }

      const status = statusOrError.value;
      const updateResult = article.updateStatus(status);
      if (updateResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(updateResult.error.message));
      }

      await this.articleCommandsRepo.save(article);
      return Result.ok(status.value);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
