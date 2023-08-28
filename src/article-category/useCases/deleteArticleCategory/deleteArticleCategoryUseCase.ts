import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ArticleRepoI } from '../../../article/articleRepo';
import { UseCase } from '../../../use-case';
import { ArticleCategoryRepoI } from '../../articleCategoryRepo';
import { DeleteArticleCategoryRequestDto } from './deleteArticleCategoryRequestDto';

export namespace DeleteArticleCategoryErrors {
  export class ArticleCategoryInUse extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'An article is using this category' });
    }
  }
}

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteArticleCategoryUseCase
  implements UseCase<DeleteArticleCategoryRequestDto, Response>
{
  constructor(
    private articleRepo: ArticleRepoI,
    private articleCategoryRepo: ArticleCategoryRepoI,
  ) {}

  execute = async (request: DeleteArticleCategoryRequestDto): Promise<Response> => {
    const { articleCategoryId } = request;

    try {
      const articleCategory = await this.articleCategoryRepo.getArticleCategory(articleCategoryId);
      const articleCategoryFound = !!articleCategory;

      if (!articleCategoryFound) {
        return left(new AppError.NotFound('Category not found'));
      }

      const article = await this.articleRepo.getArticleByCategory(articleCategoryId);
      const articleFound = !!article;

      if (articleFound) {
        return left(new DeleteArticleCategoryErrors.ArticleCategoryInUse());
      }

      await this.articleCategoryRepo.deleteArticleCategory(articleCategoryId);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
