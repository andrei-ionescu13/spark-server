import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { UseCase } from '../../../use-case';
import { textUtils } from '../../../utils/textUtils';
import { ArticleTagRepo, ArticleTagRepoI } from '../../articleTagRepo';
import { ArticleTag } from '../../model';
import { UpdateArticleTagRequestDto } from './updateArticleTagRequestDto';

export namespace UpdateArticleTagErrors {
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
  | UpdateArticleTagErrors.NameNotAvailableError
  | UpdateArticleTagErrors.SlugNotAvailableError
  | AppError.UnexpectedError
  | AppError.NotFound,
  Result<ArticleTag>
>;

export class UpdateArticleTagUseCase implements UseCase<UpdateArticleTagRequestDto, Response> {
  constructor(private articleTagRepo: ArticleTagRepoI) {}

  comparePropsToArticleTag = (props, tag): Result<UseCaseError> => {
    if (props.name === tag.name) {
      return new UpdateArticleTagErrors.NameNotAvailableError();
    }

    if (props.slug === tag.slug) {
      return new UpdateArticleTagErrors.SlugNotAvailableError();
    }

    return new AppError.UnexpectedError();
  };

  execute = async (request: UpdateArticleTagRequestDto): Promise<Response> => {
    const { articleTagId, ...props } = request;

    try {
      console.log(articleTagId);
      const articleTagToUpdate = await this.articleTagRepo.getArticleTag(articleTagId);
      let articleTagToUpdateFound = !!articleTagToUpdate;

      if (!articleTagToUpdateFound) {
        return left(new AppError.NotFound('Article tag not found'));
      }

      const existingArticleTag = await this.articleTagRepo.getArticleTagByPropsOr([
        { slug: props.slug },
        { name: props.name },
      ]);
      const articleTagFound = !!existingArticleTag;

      if (articleTagFound) {
        return left(this.comparePropsToArticleTag(props, existingArticleTag));
      }

      const updatedArticleTag = await this.articleTagRepo.updateArticle(articleTagId, props);

      if (!updatedArticleTag) {
        return left(new AppError.NotFound('Article category not found'));
      }

      return right(Result.ok(updatedArticleTag));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
