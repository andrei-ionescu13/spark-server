import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { UseCase } from '../../../use-case';
import { textUtils } from '../../../utils/textUtils';
import { ArticleTagRepoI } from '../../articleTagRepo';
import { ArticleTag } from '../../model';
import { CreateArticleTagRequestDto } from './createArticleTagRequestDto';

export namespace CreateArticleTagErrors {
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

type Response = Either<AppError.UnexpectedError, Result<ArticleTag>>;

export class CreateArticleTagUseCase implements UseCase<CreateArticleTagRequestDto, Response> {
  constructor(private articleTagRepo: ArticleTagRepoI) {}

  comparePropsToArticleTag = (props, tag): Result<UseCaseError> => {
    if (props.name === tag.name) {
      return new CreateArticleTagErrors.NameNotAvailableError();
    }

    if (props.slug === tag.slug) {
      return new CreateArticleTagErrors.SlugNotAvailableError();
    }

    return new AppError.UnexpectedError();
  };

  execute = async (request: CreateArticleTagRequestDto): Promise<Response> => {
    const props = request;
    props.slug ||= textUtils.generateSlug(props.name);

    try {
      let articleTag = await this.articleTagRepo.getArticleTagByPropsOr([
        { name: props.name, slug: props.slug },
      ]);
      const found = !!articleTag;

      if (found) {
        return left(this.comparePropsToArticleTag(props, articleTag));
      }

      articleTag = await this.articleTagRepo.createArticleTag(props);

      return right(Result.ok(articleTag.name));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
