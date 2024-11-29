import { AppError } from '../../../AppError';
import { Either, left, Result, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ArticleTagRepoI } from '../../articleTagRepo';
import { SearchArticleCategoriesRequestDto } from './searchArticleTagsRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

const MAX_LIMIT = 36;
const LIMIT = 10;

export class SearchArticleCategoriesUseCase
  implements UseCase<SearchArticleCategoriesRequestDto, Response>
{
  constructor(private articleTagRepo: ArticleTagRepoI) {}

  execute = async (request: SearchArticleCategoriesRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const tagsAndCount = await this.articleTagRepo.searchArticleCategories(request);
      console.log(tagsAndCount);
      return right(Result.ok<any>(tagsAndCount));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
