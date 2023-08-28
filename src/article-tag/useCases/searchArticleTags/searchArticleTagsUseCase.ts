import { AppError } from '../../../AppError';
import { Either, Result, right, left } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ArticleTagRepoI } from '../../articleTagRepo';
import { SearchArticleCategoriesRequestDto } from './searchArticleTagsRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

const MAX_LIMIT = 36;
const LIMIT = 12;

export class SearchArticleCategoriesUseCase
  implements UseCase<SearchArticleCategoriesRequestDto, Response>
{
  constructor(private articleTagRepo: ArticleTagRepoI) {}

  execute = async (request: SearchArticleCategoriesRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const tags = await this.articleTagRepo.searchArticleCategories(request);
      const count = await this.articleTagRepo.getArticleCategoriesCount(request);

      return right(Result.ok<any>({ tags, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
