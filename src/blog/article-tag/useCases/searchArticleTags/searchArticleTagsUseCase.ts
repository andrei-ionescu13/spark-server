import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { ArticleTag } from '../../articleTag';
import { ArticleTagQueryRepoI } from '../../repo/queries';
import { SearchArticleTagsRequestDto } from './searchArticleTagsRequestDto';

type Response = Result<{ tags: ArticleTag[]; count: number }, UseCaseErrors.UnexpectedError>;

const MAX_LIMIT = 36;
const LIMIT = 10;

export class SearchArticleCategoriesUseCase
  implements UseCase<SearchArticleTagsRequestDto, Response>
{
  constructor(private articleTagQueryRepo: ArticleTagQueryRepoI) {}

  execute = async (request: SearchArticleTagsRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const tagsAndCount = await this.articleTagQueryRepo.searchArticleCategories(query);
      return Result.ok(tagsAndCount);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
