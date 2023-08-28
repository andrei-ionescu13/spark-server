import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ArticleCategoryRepoI } from '../../../article-category/articleCategoryRepo';
import { UseCase } from '../../../use-case';
import { ArticleRepoI } from '../../articleRepo';
import { UpdateArticleCategoryRequestDto } from './updateArticleCategoryRequestDto';

export namespace UpdateArticleCategoryErrors {
  export class ArchivedArticleError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: "Can't update an archived article" });
    }
  }
}

type Response = Either<
  AppError.UnexpectedError | AppError.NotFound | UpdateArticleCategoryErrors.ArchivedArticleError,
  Result<string>
>;

export class UpdateArticleCategoryUseCase
  implements UseCase<UpdateArticleCategoryRequestDto, Response>
{
  constructor(
    private articleRepo: ArticleRepoI,
    private articleCategoryRepo: ArticleCategoryRepoI,
  ) {}

  execute = async (request: UpdateArticleCategoryRequestDto): Promise<Response> => {
    const { articleId, category } = request;

    try {
      const article = await this.articleRepo.getArticle(articleId);
      const articleFound = !!article;

      if (!articleFound) {
        return left(new AppError.NotFound('Article not found'));
      }

      if (article.status === 'archived') {
        return left(new UpdateArticleCategoryErrors.ArchivedArticleError());
      }

      const articleCategory = await this.articleCategoryRepo.getArticleCategory(category);
      const articleCategoryFound = !!articleCategory;

      if (!articleCategoryFound) {
        return left(new AppError.NotFound('Article category not found'));
      }

      const updatedArticle = await this.articleRepo.updateArticle(articleId, { category });
      const updated = !!updatedArticle;

      if (!updated) {
        return left(new AppError.NotFound('Article not found'));
      }

      return right(Result.ok<string>(updatedArticle.category));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
