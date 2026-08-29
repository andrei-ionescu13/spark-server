import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCaseError } from '../../../../../UseCaseError';
import { UseCase } from '../../../../../useCase';
import { ArticleCommandsRepo } from '../../../article/repo/commands';
import { DomainValidationError } from '../../../article/status';
import { ArticleTag } from '../../articleTag';
import { ArticleTagCommandsRepoI } from '../../repo/commands';
import { ArticleTagQueriesRepoI } from '../../repo/queries';
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
  constructor(
    private articleTagQueriesRepo: ArticleTagQueriesRepoI,
    private articleTagCommandsRepo: ArticleTagCommandsRepoI,
  ) {}

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
      const articleTagOrError = await this.articleTagCommandsRepo.getArticleTag(articleTagId);
      if (articleTagOrError.isErr()) {
        return Result.fail(new DomainValidationError(articleTagOrError.error.message));
      }

      const articleTag = articleTagOrError.value;
      if (!articleTag) {
        return Result.fail(new UseCaseErrors.NotFound('Article tag not found'));
      }

      const existingArticleTag = await this.articleTagQueriesRepo.getArticleTagByPropsOr([
        { slug: props.slug },
        { name: props.name },
      ]);

      if (existingArticleTag) {
        const result = this.comparePropsToArticleTag(props, existingArticleTag);

        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new UseCaseErrors.UnexpectedError());
      }

      articleTag.updateNameAndSlug(props.name, props.slug);
      this.articleTagCommandsRepo.save(articleTag);

      return Result.ok(articleTag);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
