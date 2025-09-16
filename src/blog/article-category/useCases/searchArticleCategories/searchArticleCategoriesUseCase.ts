import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { ArticleCategoryDto } from '../../articleCategoryMapper';
import { ArticleCategoryQueryRepoI } from '../../repo/queries';
import { SearchArticleCategoriesRequestDto } from './searchArticleCategoriesRequestDto';

type Response = Result<
  { categories: ArticleCategoryDto[]; count: number },
  UseCaseErrors.UnexpectedError
>;

const MAX_LIMIT = 36;
const LIMIT = 10;

export class SearchArticleCategoriesUseCase
  implements UseCase<SearchArticleCategoriesRequestDto, Response>
{
  constructor(private articleCategoryQueryRepo: ArticleCategoryQueryRepoI) {}

  execute = async (request: SearchArticleCategoriesRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const categoriesAndCount = await this.articleCategoryQueryRepo.searchArticleCategories(query);

      return Result.ok(categoriesAndCount);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
