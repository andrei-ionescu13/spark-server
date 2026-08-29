import { textUtils } from '../../../../../../utils/textUtils';
import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCaseError } from '../../../../../UseCaseError';
import { UseCase } from '../../../../../useCase';
import { ArticleTag } from '../../articleTag';
import { ArticleTagCommandsRepoI } from '../../repo/commands';
import { ArticleTagQueriesRepoI } from '../../repo/queries';
import { CreateArticleTagRequestDto } from './createArticleTagRequestDto';
import { v7 as uuidv7 } from 'uuid';

export namespace CreateArticleTagErrors {
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

type Response = Result<string, UseCaseErrors.UnexpectedError>;

export class CreateArticleTagUseCase implements UseCase<CreateArticleTagRequestDto, Response> {
  constructor(
    private articleTagCommandsRepo: ArticleTagCommandsRepoI,
    private articleTagQueriesRepo: ArticleTagQueriesRepoI,
  ) {}

  comparePropsToArticleTag = (props, tag): Result<void, UseCaseError> => {
    if (props.name === tag.name) {
      return Result.fail(new CreateArticleTagErrors.NameNotAvailableError());
    }

    if (props.slug === tag.slug) {
      return Result.fail(new CreateArticleTagErrors.SlugNotAvailableError());
    }

    return Result.ok();
  };

  execute = async (request: CreateArticleTagRequestDto): Promise<Response> => {
    const props = {
      ...request,
      slug: request.slug || textUtils.generateSlug(request.name),
    };

    try {
      const articleTagFound = await this.articleTagQueriesRepo.getArticleTagByPropsOr([
        { name: request.name, slug: request.slug },
      ]);

      if (articleTagFound) {
        const result = this.comparePropsToArticleTag(request, articleTagFound);

        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new UseCaseErrors.UnexpectedError());
      }

      const articleTagOrError = ArticleTag.create({
        ...props,
        _id: uuidv7(),
        createdAt: new Date(),
        updatedAt: null,
      });
      if (articleTagOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(articleTagOrError.error.message));
      }

      const articleTag = articleTagOrError.value;
      this.articleTagCommandsRepo.save(articleTag);

      return Result.ok(articleTag._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
