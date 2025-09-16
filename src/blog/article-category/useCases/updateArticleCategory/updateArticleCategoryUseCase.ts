import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCaseError } from '../../../../UseCaseError';
import { UseCase } from '../../../../use-case';
import { ArticleCategory } from '../../articleCategory';
import { ArticleCategoryDto } from '../../articleCategoryMapper';
import { ArticleCategoryCommandRepoI } from '../../repo/commands';
import { ArticleCategoryQueryRepoI } from '../../repo/queries';
import { UpdateArticleCategoryRequestDto } from './updateArticleCategoryRequestDto';

export namespace UpdateArticleCategoryErrors {
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
  export class ValidationError extends UseCaseError {
    constructor() {
      super('Name or slug not available');
    }
  }
}

type Response = Result<
  ArticleCategory,
  | UseCaseErrors.UnexpectedError
  | UseCaseErrors.NotFound
  | UpdateArticleCategoryErrors.NameNotAvailableError
  | UpdateArticleCategoryErrors.SlugNotAvailableError
>;

export class UpdateArticleCategoryUseCase
  implements UseCase<UpdateArticleCategoryRequestDto, Response>
{
  constructor(
    private articleCategoryCommandRepo: ArticleCategoryCommandRepoI,
    private articleCategoryQueryRepo: ArticleCategoryQueryRepoI,
  ) {}

  comparePropsToArticleCategory = (
    props: Pick<UpdateArticleCategoryRequestDto, 'name' | 'slug'>,
    articleCategory: ArticleCategoryDto,
  ): Result<void, UseCaseError> => {
    if (props.name === articleCategory.name) {
      return Result.fail(new UpdateArticleCategoryErrors.NameNotAvailableError());
    }

    if (props.slug === articleCategory.slug) {
      return Result.fail(new UpdateArticleCategoryErrors.SlugNotAvailableError());
    }

    return Result.ok();
  };

  execute = async (request: UpdateArticleCategoryRequestDto): Promise<Response> => {
    const { articleCategoryId, ...props } = request;

    try {
      const articleCategoryOrError = await this.articleCategoryCommandRepo.getArticleCategory(
        articleCategoryId,
      );

      if (articleCategoryOrError.isErr()) {
        return Result.fail(new UseCaseErrors.ValidationError(articleCategoryOrError.error.message));
      }

      const articleCategory = articleCategoryOrError.value;
      if (!articleCategory) {
        return Result.fail(new UseCaseErrors.NotFound('Article category not found'));
      }

      const articleCategoryByProps =
        await this.articleCategoryQueryRepo.getArticleCategoryByPropsOr([
          { name: props.name, slug: props.slug },
        ]);

      if (articleCategoryByProps) {
        const result = this.comparePropsToArticleCategory(props, articleCategoryByProps);

        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new UpdateArticleCategoryErrors.ValidationError());
      }

      articleCategory.updateNameAndSlug(props.name, props.slug);
      await this.articleCategoryCommandRepo.save(articleCategory);

      return Result.ok(articleCategory);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
