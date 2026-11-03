import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../result';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { ArticleCategoryQueriesRepoI } from '../../../article-category/repo/queries';
import { ArticleCommandsRepoI } from '../../repo/commands';
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
    private articleCommandsRepo: ArticleCommandsRepoI,
    private articleCategoryQueriesRepo: ArticleCategoryQueriesRepoI,
  ) {}

  execute = async (request: UpdateArticleCategoryRequestDto): Promise<Response> => {
    try {
      const article = await this.articleCommandsRepo.getArticle(request.articleId);
      if (!article) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      if (article.isArchived) {
        return Result.fail(new UpdateArticleCategoryErrors.ArchivedArticleError());
      }

      const category = await this.articleCategoryQueriesRepo.getArticleCategory(request.category);
      if (!category) {
        return Result.fail(new UseCaseErrors.NotFound('Article category not found'));
      }

      const updateResult = article.updateCategory(category._id);
      if (updateResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(updateResult.error.message));
      }

      await this.articleCommandsRepo.save(article);
      return Result.ok(category.name);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
