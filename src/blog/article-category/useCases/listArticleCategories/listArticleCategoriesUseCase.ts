import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { ArticleCategoryDto } from '../../articleCategoryMapper';
import { ArticleCategoryQueryRepoI } from '../../repo/queries';
import { ListArticleCategoriesRequestDto } from './listArticleCategoriesRequestDto';

type Response = Result<ArticleCategoryDto[], UseCaseErrors.UnexpectedError>;

export class ListArticleCategoriesUseCase
  implements UseCase<ListArticleCategoriesRequestDto, Response>
{
  constructor(private articleCategoryQueryRepo: ArticleCategoryQueryRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const articleCategories = await this.articleCategoryQueryRepo.listArticleCategories();

      return Result.ok(articleCategories);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
