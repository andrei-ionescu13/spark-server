import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { UseCaseError } from '../../../../UseCaseError';
import { ArticleCategoryQueryRepoI } from '../../../article-category/repo/queries';
import { ArticleCommandRepoI } from '../../repo/commands';
import { UpdateArticleCategoryRequestDto } from './updateArticleCategoryRequestDto';

export namespace UpdateArticleCategoryErrors {
  export class ArchivedArticleError extends UseCaseError {
    constructor() {
      super("Can't update an archived article");
    }
  }
}

type Response = Result<
  string,
  | UseCaseErrors.UnexpectedError
  | UseCaseErrors.NotFound
  | UpdateArticleCategoryErrors.ArchivedArticleError
>;

export class UpdateArticleCategoryUseCase
  implements UseCase<UpdateArticleCategoryRequestDto, Response>
{
  constructor(
    private articleCommandRepo: ArticleCommandRepoI,
    private articleCategoryQueryRepo: ArticleCategoryQueryRepoI,
  ) {}

  execute = async (request: UpdateArticleCategoryRequestDto): Promise<Response> => {
    const { articleId, category } = request;

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
        return Result.fail(new UpdateArticleCategoryErrors.ArchivedArticleError());
      }

      const articleCategory = await this.articleCategoryQueryRepo.getArticleCategory(category);

      if (!articleCategory) {
        return Result.fail(new UseCaseErrors.NotFound('Article category not found'));
      }

      const updatedArticleOrError = await this.articleCommandRepo.updateArticle(articleId, {
        category,
      });

      if (updatedArticleOrError.isErr()) {
        return Result.fail(new UseCaseErrors.ValidationError(updatedArticleOrError.error.message));
      }

      const updatedArticle = updatedArticleOrError.value;

      if (!updatedArticle) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      return Result.ok(updatedArticle.category);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
