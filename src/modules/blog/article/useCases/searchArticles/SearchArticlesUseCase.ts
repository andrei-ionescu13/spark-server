import { UseCaseErrors } from '../../../../../appErrors';
import { Result } from '../../../../../results';
import { UseCase } from '../../../../../useCase';
import { ArticleCategoryQueriesRepoI } from '../../../article-category/repo/queries';
import { ArticlePopulatedDto } from '../../articleMapper';
import { ArticleQueriesRepoI } from '../../repo/queries';
import { SearchArticlesRequestDto } from './SearchArticlesRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<
  { articles: ArticlePopulatedDto[]; count: number },
  UseCaseErrors.UnexpectedError
>;

export class SearchArticlesUseCase implements UseCase<SearchArticlesRequestDto, Response> {
  constructor(
    private articleQueriesRepo: ArticleQueriesRepoI,
    private articleCategoryQueriesRepo: ArticleCategoryQueriesRepoI,
  ) {}

  execute = async (request: SearchArticlesRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      if (query.category) {
        const articleCategory = await this.articleCategoryQueriesRepo.getArticleCategoryByName(
          query.category,
        );
        query.category = articleCategory ? articleCategory._id : undefined;
      }

      const articlesAndCount = await this.articleQueriesRepo.searchArticles(query);

      return Result.ok(articlesAndCount);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
