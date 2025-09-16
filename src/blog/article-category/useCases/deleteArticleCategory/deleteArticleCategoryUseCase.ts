import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { UseCaseError } from '../../../../UseCaseError';
import { ArticleQueryRepoI } from '../../../article/articleRepo';
import { ArticleCategoryCommandRepoI } from '../../repo/commands';
import { ArticleCategoryQueryRepoI } from '../../repo/queries';
import { DeleteArticleCategoryRequestDto } from './deleteArticleCategoryRequestDto';

export namespace DeleteArticleCategoryErrors {
  export class ArticleCategoryInUse extends UseCaseError {
    constructor() {
      super('An article is using this category');
    }
  }
}

type Response = Result<void, UseCaseErrors.UnexpectedError>;

export class DeleteArticleCategoryUseCase
  implements UseCase<DeleteArticleCategoryRequestDto, Response>
{
  constructor(
    private articleQueryRepo: ArticleQueryRepoI,
    private articleCategoryCommandRepo: ArticleCategoryCommandRepoI,
    private articleCategoryQueryRepo: ArticleCategoryQueryRepoI,
  ) {}

  execute = async (request: DeleteArticleCategoryRequestDto): Promise<Response> => {
    const { articleCategoryId } = request;

    try {
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
        return Result.fail(new DeleteArticleCategoryErrors.ArticleCategoryInUse());
      }

      await this.articleCategoryCommandRepo.deleteArticleCategory(articleCategoryId);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
