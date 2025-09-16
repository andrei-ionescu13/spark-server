import { textUtils } from '../../../../../utils/textUtils';
import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCaseError } from '../../../../UseCaseError';
import { UseCase } from '../../../../use-case';
import { ArticleTagRepoI } from '../../articleTagRepo';
import { CreateArticleTagRequestDto } from './createArticleTagRequestDto';

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
  constructor(private articleTagRepo: ArticleTagRepoI) {}

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
      let articleTag = await this.articleTagRepo.getArticleTagByPropsOr([
        { name: props.name, slug: props.slug },
      ]);
      const found = !!articleTag;

      if (found) {
        const result = this.comparePropsToArticleTag(props, articleTag);

        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new UseCaseErrors.UnexpectedError());
      }

      articleTag = await this.articleTagRepo.createArticleTag(props);

      return Result.ok(articleTag.props.name);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
