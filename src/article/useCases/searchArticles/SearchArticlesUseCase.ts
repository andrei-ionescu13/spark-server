import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ArticleRepoI } from '../../articleRepo';
import { SearchArticlesRequestDto } from './SearchArticlesRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 12;

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchArticlesUseCase implements UseCase<SearchArticlesRequestDto, Response> {
  constructor(private articleRepo: ArticleRepoI) {}

  execute = async (request: SearchArticlesRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const articles = await this.articleRepo.searchArticles(request);
      const count = await this.articleRepo.getArticlesCount(request);

      return right(Result.ok<any>({ articles, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
