import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { ArticleTag } from '../../articleTag';
import { ArticleTagRepoI } from '../../articleTagRepo';
import { SearchArticleTagsRequestDto } from './searchArticleTagsRequestDto';

type Response = Result<{ tags: ArticleTag[]; count: number }, UseCaseErrors.UnexpectedError>;

const MAX_LIMIT = 36;
const LIMIT = 10;

export class SearchArticleCategoriesUseCase
  implements UseCase<SearchArticleTagsRequestDto, Response>
{
  constructor(private articleTagRepo: ArticleTagRepoI) {}

  execute = async (request: SearchArticleTagsRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const tagsAndCount = await this.articleTagRepo.searchArticleCategories(query);

      return Result.ok(tagsAndCount);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
