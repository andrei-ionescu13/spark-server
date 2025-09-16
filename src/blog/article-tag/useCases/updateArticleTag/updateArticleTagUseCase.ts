import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCaseError } from '../../../../UseCaseError';
import { UseCase } from '../../../../use-case';
import { ArticleTag } from '../../articleTag';
import { ArticleTagRepoI } from '../../articleTagRepo';
import { UpdateArticleTagRequestDto } from './updateArticleTagRequestDto';

export namespace UpdateArticleTagErrors {
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
  ArticleTag,
  | UpdateArticleTagErrors.NameNotAvailableError
  | UpdateArticleTagErrors.SlugNotAvailableError
  | UseCaseErrors.UnexpectedError
  | UseCaseErrors.NotFound
>;

export class UpdateArticleTagUseCase implements UseCase<UpdateArticleTagRequestDto, Response> {
  constructor(private articleTagRepo: ArticleTagRepoI) {}

  comparePropsToArticleTag = (props, tag): Result<void, UseCaseError> => {
    if (props.name === tag.name) {
      return Result.fail(new UpdateArticleTagErrors.NameNotAvailableError());
    }

    if (props.slug === tag.slug) {
      return Result.fail(new UpdateArticleTagErrors.SlugNotAvailableError());
    }

    return Result.ok();
  };

  execute = async (request: UpdateArticleTagRequestDto): Promise<Response> => {
    const { articleTagId, ...props } = request;

    try {
      const articleTagToUpdate = await this.articleTagRepo.getArticleTag(articleTagId);
      let articleTagToUpdateFound = !!articleTagToUpdate;

      if (!articleTagToUpdateFound) {
        return Result.fail(new UseCaseErrors.NotFound('Article tag not found'));
      }

      const existingArticleTag = await this.articleTagRepo.getArticleTagByPropsOr([
        { slug: props.slug },
        { name: props.name },
      ]);
      const articleTagFound = !!existingArticleTag;

      if (articleTagFound) {
        const result = this.comparePropsToArticleTag(props, existingArticleTag);

        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new UseCaseErrors.UnexpectedError());
      }

      const updatedArticleTag = await this.articleTagRepo.updateArticleTag(articleTagId, props);

      if (!updatedArticleTag) {
        return Result.fail(new UseCaseErrors.NotFound('Article category not found'));
      }

      return Result.ok(updatedArticleTag);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
