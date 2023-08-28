import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ArticleRepoI } from '../../../article/articleRepo';
import { UseCase } from '../../../use-case';
import { ArticleCategoryRepoI } from '../../articleCategoryRepo';
import { DeleteArticleCategoryBulkRequestDto } from './deleteArticleCategoryBulkRequestDto';

export namespace DeleteArticleCategoryBulkErrors {
  export class ArticleCategoryInUse extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'An article is using this category' });
    }
  }
}

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteArticleCategoryBulkUseCase
  implements UseCase<DeleteArticleCategoryBulkRequestDto, Response>
{
  constructor(
    private articleRepo: ArticleRepoI,
    private articleCategoryRepo: ArticleCategoryRepoI,
  ) {}

  deleteArticleCategory = async (
    articleCategoryId: string,
  ): Promise<Result<UseCaseError | void>> => {
    const articleCategory = await this.articleCategoryRepo.getArticleCategory(articleCategoryId);
    const articleCategoryFound = !!articleCategory;

    if (!articleCategoryFound) {
      return new AppError.NotFound('Category not found');
    }

    const article = await this.articleRepo.getArticleByCategory(articleCategoryId);
    const articleFound = !!article;

    if (articleFound) {
      return new DeleteArticleCategoryBulkErrors.ArticleCategoryInUse();
    }

    await this.articleCategoryRepo.deleteArticleCategory(articleCategoryId);

    return Result.ok();
  };

  execute = async (request: DeleteArticleCategoryBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      const responses = await Promise.all(
        ids.map((articleCategoryId) => this.deleteArticleCategory(articleCategoryId)),
      );

      const combinedResult = Result.combine(responses);

      if (combinedResult.isFailure) {
        return left(combinedResult);
      }

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
