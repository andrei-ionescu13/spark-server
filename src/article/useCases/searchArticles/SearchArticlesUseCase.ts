import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { ArticleCategoryRepoI } from '../../../article-category/articleCategoryRepo';
import { ArticleCategory } from '../../../article-category/model';
import { UseCase } from '../../../use-case';
import { ArticleRepoI } from '../../articleRepo';
import { SearchArticlesRequestDto } from './SearchArticlesRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Either<
  AppError.UnexpectedError,
  Result<{ articles: ArticleCategory[]; count: number }>
>;

export class SearchArticlesUseCase implements UseCase<SearchArticlesRequestDto, Response> {
  constructor(
    private articleRepo: ArticleRepoI,
    private articleCategoryRepo: ArticleCategoryRepoI,
  ) {}

  execute = async (request: SearchArticlesRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      if (query.category) {
        const articleCategory = await this.articleCategoryRepo.getArticleCategoryByName(
          query.category,
        );
        query.category = articleCategory._id;
      }

      const articlesAndCount = await this.articleRepo.searchArticles(query);

      return right(Result.ok<any>(articlesAndCount));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
