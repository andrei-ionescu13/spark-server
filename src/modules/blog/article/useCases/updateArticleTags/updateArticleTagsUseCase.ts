import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { ArticleTagQueriesRepoI } from '../../../article-tag/repo/queries';
import { ArticleCommandsRepoI } from '../../repo/commands';
import { UpdateArticleTagsRequestDto } from './updateArticleTagsRequestDto';

export namespace UpdateArticleTagsErrors {
  export class ArchivedArticleError extends UseCaseError {
    constructor() {
      super("Can't update an archived article");
    }
  }
}

type Response = Result<string[], UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateArticleTagsUseCase implements UseCase<UpdateArticleTagsRequestDto, Response> {
  constructor(
    private articleCommandsRepo: ArticleCommandsRepoI,
    private articleTagQueriesRepo: ArticleTagQueriesRepoI,
  ) {}

  execute = async (request: UpdateArticleTagsRequestDto): Promise<Response> => {
    const { articleId, tags } = request;

    try {
      const articleOrError = await this.articleCommandsRepo.getArticle(articleId);

      if (articleOrError.isErr()) {
        return Result.fail(new UseCaseErrors.ValidationError(articleOrError.error.message));
      }

      const article = articleOrError.value;

      if (!article) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      if (article.isArchived()) {
        return Result.fail(new UpdateArticleTagsErrors.ArchivedArticleError());
      }

      const articleTags = await this.articleTagQueriesRepo.getArticleTags(tags);

      if (tags.length !== articleTags.length) {
        return Result.fail(new UseCaseErrors.NotFound('Tags not found'));
      }

      const updatedArticleOrError = await this.articleCommandsRepo.updateArticle(articleId, {
        tags,
      });
      if (updatedArticleOrError.isErr()) {
        return Result.fail(new UseCaseErrors.ValidationError(updatedArticleOrError.error.message));
      }

      const updatedArticle = updatedArticleOrError.value;

      if (!updatedArticle) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      return Result.ok(updatedArticle.tags);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
