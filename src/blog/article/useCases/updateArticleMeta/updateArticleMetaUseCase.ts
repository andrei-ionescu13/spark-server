import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCaseError } from '../../../../UseCaseError';
import { UseCase } from '../../../../use-case';
import { Article } from '../../article';
import { ArticleCommandRepoI } from '../../repo/commands';
import { UpdateArticleMetaRequestDto } from './updateArticleMetaRequestDto';

export namespace UpdateArticleMetaErrors {
  export class ArchivedArticleError extends UseCaseError {
    constructor() {
      super("Can't update an archived article");
    }
  }
}

type Response = Result<
  Pick<Article, 'meta' | 'updatedAt'>,
  | UseCaseErrors.UnexpectedError
  | UseCaseErrors.NotFound
  | UpdateArticleMetaErrors.ArchivedArticleError
>;

export class UpdateArticleMetaUseCase implements UseCase<UpdateArticleMetaRequestDto, Response> {
  constructor(private articleCommandRepo: ArticleCommandRepoI) {}

  execute = async (request: UpdateArticleMetaRequestDto): Promise<Response> => {
    const { articleId, ...props } = request;

    try {
      const articleOrError = await this.articleCommandRepo.getArticle(articleId);

      if (articleOrError.isErr()) {
        return Result.fail(new UseCaseErrors.ValidationError(articleOrError.error.message));
      }

      const article = articleOrError.value;

      if (!article) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      if (article.isArchived()) {
        return Result.fail(new UpdateArticleMetaErrors.ArchivedArticleError());
      }

      const updatedArticleOrError = await this.articleCommandRepo.updateArticle(articleId, {
        meta: props,
      });

      if (updatedArticleOrError.isErr()) {
        return Result.fail(new UseCaseErrors.ValidationError(updatedArticleOrError.error.message));
      }

      const updatedArticle = updatedArticleOrError.value;

      if (!updatedArticle) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      const { meta, updatedAt } = updatedArticle;

      return Result.ok({ meta, updatedAt });
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
