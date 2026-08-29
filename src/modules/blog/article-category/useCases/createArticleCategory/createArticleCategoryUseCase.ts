import { textUtils } from '../../../../../../utils/textUtils';
import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCaseError } from '../../../../../UseCaseError';
import { UseCase } from '../../../../../useCase';
import { ArticleCategory } from '../../articleCategory';
import { ArticleCategoryCommandsRepoI } from '../../repo/commands';
import { ArticleCategoryQueriesRepoI } from '../../repo/queries';
import { CreateArticleCategoryRequestDto } from './createArticleCategoryRequestDto';

export namespace CreateArticleCategoryErrors {
  export class NameNotAvailableError extends UseCaseError {
    constructor() {
      super('Name not available');
    }
  }

  export class SlugNotAvailableError extends UseCaseError {
    constructor() {
      super('Slug not available');
    }
  }
}

type Response = Result<
  ArticleCategory,
  | CreateArticleCategoryErrors.NameNotAvailableError
  | CreateArticleCategoryErrors.SlugNotAvailableError
  | UseCaseErrors.UnexpectedError
>;

export class CreateArticleCategoryUseCase
  implements UseCase<CreateArticleCategoryRequestDto, Response>
{
  constructor(
    private articleCategoryCommandsRepo: ArticleCategoryCommandsRepoI,
    private articleCategoryQueriesRepo: ArticleCategoryQueriesRepoI,
  ) {}

  comparePropsToArticleCategory = (props, tag): Result<void, UseCaseError> => {
    if (props.name === tag.name) {
      return Result.fail(new CreateArticleCategoryErrors.NameNotAvailableError());
    }

    if (props.slug === tag.slug) {
      return Result.fail(new CreateArticleCategoryErrors.SlugNotAvailableError());
    }

    return Result.ok();
  };

  execute = async (request: CreateArticleCategoryRequestDto): Promise<Response> => {
    const props = {
      ...request,
      slug: request.slug || textUtils.generateSlug(request.name),
    };

    try {
      const articleCategory = await this.articleCategoryQueriesRepo.getArticleCategoryByPropsOr([
        { name: props.name, slug: props.slug },
      ]);
      const found = !!articleCategory;

      if (found) {
        const result = this.comparePropsToArticleCategory(props, articleCategory);

        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new UseCaseErrors.UnexpectedError());
      }

      const createdArticleCategoryOrError =
        await this.articleCategoryCommandsRepo.createArticleCategory(props);

      if (createdArticleCategoryOrError.isErr()) {
        return Result.fail(
          new UseCaseErrors.ValidationError(createdArticleCategoryOrError.error.message),
        );
      }

      const createdArticleCategory = createdArticleCategoryOrError.value;

      return Result.ok(createdArticleCategory);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
