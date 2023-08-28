import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { UseCase } from '../../../use-case';
import { textUtils } from '../../../utils/textUtils';
import { ArticleCategoryRepo, ArticleCategoryRepoI } from '../../articleCategoryRepo';
import { ArticleCategory } from '../../model';
import { UpdateArticleCategoryRequestDto } from './updateArticleCategoryRequestDto';

export namespace UpdateArticleCategoryErrors {
  export class NameNotAvailableError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Name not available' });
    }
  }

  export class SlugNotAvailableError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Slug not available' });
    }
  }
}

type Response = Either<
  | AppError.UnexpectedError
  | AppError.NotFound
  | UpdateArticleCategoryErrors.NameNotAvailableError
  | UpdateArticleCategoryErrors.SlugNotAvailableError,
  Result<ArticleCategory>
>;

export class UpdateArticleCategoryUseCase
  implements UseCase<UpdateArticleCategoryRequestDto, Response>
{
  constructor(private articleCategoryRepo: ArticleCategoryRepoI) {}

  comparePropsToArticleCategory = (props, tag): Result<UseCaseError> => {
    if (props.name === tag.name) {
      return new UpdateArticleCategoryErrors.NameNotAvailableError();
    }

    if (props.slug === tag.slug) {
      return new UpdateArticleCategoryErrors.SlugNotAvailableError();
    }

    return new AppError.UnexpectedError();
  };

  execute = async (request: UpdateArticleCategoryRequestDto): Promise<Response> => {
    const { articleCategoryId, ...props } = request;

    try {
      const articleCategoryToUpdate = await this.articleCategoryRepo.getArticleCategory(
        articleCategoryId,
      );
      const articleCategoryToUpdateFound = !!articleCategoryToUpdate;

      if (!articleCategoryToUpdateFound) {
        return left(new AppError.NotFound('Article category not found'));
      }

      const articleCategoryByProps = await this.articleCategoryRepo.getArticleCategoryByPropsOr([
        { name: props.name, slug: props.slug },
      ]);
      const articleCategoryByPropsFound = !!articleCategoryByProps;

      if (articleCategoryByPropsFound) {
        return left(this.comparePropsToArticleCategory(props, articleCategoryByProps));
      }

      const updatedArticleCategory = await this.articleCategoryRepo.updateArticle(
        articleCategoryId,
        props,
      );

      if (!updatedArticleCategory) {
        return left(new AppError.NotFound('Article category not found'));
      }

      return right(Result.ok(updatedArticleCategory));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
