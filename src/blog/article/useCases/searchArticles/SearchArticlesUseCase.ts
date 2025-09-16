import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { ArticleCategoryQueryRepoI } from '../../../article-category/repo/queries';
import { ArticleDto } from '../../articleMapper';
import { ArticleQueryRepoI } from '../../repo/queries';
import { SearchArticlesRequestDto } from './SearchArticlesRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<{ articles: ArticleDto[]; count: number }, UseCaseErrors.UnexpectedError>;

export class SearchArticlesUseCase implements UseCase<SearchArticlesRequestDto, Response> {
  constructor(
    private articleQueryRepo: ArticleQueryRepoI,
    private articleCategoryQueryRepo: ArticleCategoryQueryRepoI,
  ) {}

  execute = async (request: SearchArticlesRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      if (query.category) {
        const articleCategory = await this.articleCategoryQueryRepo.getArticleCategoryByName(
          query.category,
        );
        query.category = articleCategory ? articleCategory._id : undefined;
      }

      const articlesAndCount = await this.articleQueryRepo.searchArticles(query);

      return Result.ok(articlesAndCount);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
