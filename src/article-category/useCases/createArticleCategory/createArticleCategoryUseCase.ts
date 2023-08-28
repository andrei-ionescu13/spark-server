import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { UseCase } from '../../../use-case';
import { textUtils } from '../../../utils/textUtils';
import { ArticleCategoryRepoI } from '../../articleCategoryRepo';
import { ArticleCategory } from '../../model';
import { CreateArticleCategoryRequestDto } from './createArticleCategoryRequestDto';

export namespace CreateArticleCategoryErrors {
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

type Response = Either<AppError.UnexpectedError, Result<ArticleCategory>>;

export class CreateArticleCategoryUseCase
  implements UseCase<CreateArticleCategoryRequestDto, Response>
{
  constructor(private articleCategoryRepo: ArticleCategoryRepoI) {}

  comparePropsToArticleCategory = (props, tag): Result<UseCaseError> => {
    if (props.name === tag.name) {
      return new CreateArticleCategoryErrors.NameNotAvailableError();
    }

    if (props.slug === tag.slug) {
      return new CreateArticleCategoryErrors.SlugNotAvailableError();
    }

    return new AppError.UnexpectedError();
  };

  execute = async (request: CreateArticleCategoryRequestDto): Promise<Response> => {
    const props = request;
    props.slug ||= textUtils.generateSlug(props.name);

    try {
      let articleCategory = await this.articleCategoryRepo.getArticleCategoryByPropsOr([
        { name: props.name, slug: props.slug },
      ]);
      const found = !!articleCategory;

      if (found) {
        return left(this.comparePropsToArticleCategory(props, articleCategory));
      }

      articleCategory = await this.articleCategoryRepo.createArticleCategory(props);

      return right(Result.ok(articleCategory));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
