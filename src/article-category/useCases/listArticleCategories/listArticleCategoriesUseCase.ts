import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ArticleCategoryRepoI } from '../../articleCategoryRepo';
import { ArticleCategory } from '../../model';
import { ListArticleCategoriesRequestDto } from './listArticleCategoriesRequestDto';

type Response = Either<AppError.UnexpectedError, Result<ArticleCategory[]>>;

export class ListArticleCategoriesUseCase
  implements UseCase<ListArticleCategoriesRequestDto, Response>
{
  constructor(private articleCategoryRepo: ArticleCategoryRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const articleCategories = await this.articleCategoryRepo.listArticleCategories();

      return right(Result.ok(articleCategories));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
