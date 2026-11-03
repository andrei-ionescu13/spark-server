import { textUtils } from '../../../../../utils/textUtils';
import { UseCaseErrors } from '../../../../../AppError';
import { UseCaseError } from '../../../../../UseCaseError';
import { Result } from '../../../../../result';
import { UseCase } from '../../../../../useCase';
import { ArticleCategory } from '../../domain/articleCategory';
import { ArticleCategoryCommandsRepoI } from '../../repo/commands';
import { ArticleCategoryQueriesRepoI } from '../../repo/queries';
import { CreateArticleCategoryRequestDto } from './createArticleCategoryRequestDto';
import { v7 as uuid7 } from 'uuid';

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
  string,
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
      const existingArticleCategory =
        await this.articleCategoryQueriesRepo.getArticleCategoryByPropsOr([
          { name: props.name, slug: props.slug },
        ]);
      if (existingArticleCategory) {
        const result = this.comparePropsToArticleCategory(props, existingArticleCategory);

        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new UseCaseErrors.UnexpectedError());
      }

      const articleCategoryOrError = ArticleCategory.create(props);

      if (articleCategoryOrError.isErr()) {
        return Result.fail(new UseCaseErrors.ValidationError(articleCategoryOrError.error.message));
      }
      const articleCategory = articleCategoryOrError.value;
      await this.articleCategoryCommandsRepo.save(articleCategory);
      return Result.ok(articleCategory._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
