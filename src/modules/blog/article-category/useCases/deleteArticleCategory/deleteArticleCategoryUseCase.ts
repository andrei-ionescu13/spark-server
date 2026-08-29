import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { ArticleQueriesRepoI } from '../../../article/articleRepo';
import { ArticleCategoryCommandsRepoI } from '../../repo/commands';
import { ArticleCategoryQueriesRepoI } from '../../repo/queries';
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
    private articleQueriesRepo: ArticleQueriesRepoI,
    private articleCategoryCommandsRepo: ArticleCategoryCommandsRepoI,
    private articleCategoryQueriesRepo: ArticleCategoryQueriesRepoI,
  ) {}

  execute = async (request: DeleteArticleCategoryRequestDto): Promise<Response> => {
    const { articleCategoryId } = request;

    try {
      const articleCategory = await this.articleCategoryQueriesRepo.getArticleCategory(
        articleCategoryId,
      );
      const articleCategoryFound = !!articleCategory;

      if (!articleCategoryFound) {
        return Result.fail(new UseCaseErrors.NotFound('Category not found'));
      }

      const article = await this.articleQueriesRepo.getArticleByCategory(articleCategoryId);
      const articleFound = !!article;

      if (articleFound) {
        return Result.fail(new DeleteArticleCategoryErrors.ArticleCategoryInUse());
      }

      await this.articleCategoryCommandsRepo.deleteArticleCategory(articleCategoryId);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
