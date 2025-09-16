import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { UseCaseError } from '../../../../UseCaseError';
import { ArticleQueryRepoI } from '../../../article/repo/queries';
import { ArticleCategoryCommandRepoI } from '../../repo/commands';
import { ArticleCategoryQueryRepoI } from '../../repo/queries';
import { DeleteArticleCategoryBulkRequestDto } from './deleteArticleCategoryBulkRequestDto';

export namespace DeleteArticleCategoryBulkErrors {
  export class ArticleCategoryInUse extends UseCaseError {
    constructor() {
      super('An article is using this category');
    }
  }
}

type Response = Result<void, UseCaseErrors.UnexpectedError>;

export class DeleteArticleCategoryBulkUseCase
  implements UseCase<DeleteArticleCategoryBulkRequestDto, Response>
{
  constructor(
    private articleQueryRepo: ArticleQueryRepoI,
    private articleCategoryCommandRepo: ArticleCategoryCommandRepoI,
    private articleCategoryQueryRepo: ArticleCategoryQueryRepoI,
  ) {}

  deleteArticleCategory = async (
    articleCategoryId: string,
  ): Promise<Result<void, UseCaseError>> => {
    const articleCategory = await this.articleCategoryQueryRepo.getArticleCategory(
      articleCategoryId,
    );
    const articleCategoryFound = !!articleCategory;

    if (!articleCategoryFound) {
      return Result.fail(new UseCaseErrors.NotFound('Category not found'));
    }

    const article = await this.articleQueryRepo.getArticleByCategory(articleCategoryId);
    const articleFound = !!article;

    if (articleFound) {
      return Result.fail(new DeleteArticleCategoryBulkErrors.ArticleCategoryInUse());
    }

    await this.articleCategoryCommandRepo.deleteArticleCategory(articleCategoryId);

    return Result.ok();
  };

  execute = async (request: DeleteArticleCategoryBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      const responses = await Promise.all(
        ids.map((articleCategoryId) => this.deleteArticleCategory(articleCategoryId)),
      );

      const combinedResult = Result.combine(responses);

      if (combinedResult.isErr()) {
        return combinedResult;
      }

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
