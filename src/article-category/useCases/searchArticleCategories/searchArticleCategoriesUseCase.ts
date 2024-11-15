import { AppError } from '../../../AppError';
import { Either, Result, right, left } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ArticleCategoryRepoI } from '../../articleCategoryRepo';
import { SearchArticleCategoriesRequestDto } from './searchArticleCategoriesRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

const MAX_LIMIT = 36;
const LIMIT = 12;

export class SearchArticleCategoriesUseCase
  implements UseCase<SearchArticleCategoriesRequestDto, Response>
{
  constructor(private articleCategoryRepo: ArticleCategoryRepoI) {}

  execute = async (request: SearchArticleCategoriesRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const categoriesAndCount = await this.articleCategoryRepo.searchArticleCategories(request);

      return right(Result.ok<any>(categoriesAndCount));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
