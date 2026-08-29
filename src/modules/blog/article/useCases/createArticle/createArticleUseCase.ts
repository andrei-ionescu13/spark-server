import { textUtils } from '../../../../../../utils/textUtils';
import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UploaderService } from '../../../../../services/uploaderService';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { ArticleDto } from '../../articleMapper';
import { ArticleCommandsRepoI } from '../../repo/commands';
import { ArticleQueriesRepoI } from '../../repo/queries';
import { RequestValidationError } from '../../status';
import { CreateArticleRequestDto } from './createArticleRequestDto';

export namespace CreateArticleCategoryErrors {
  export class TitleNotAvailableError extends UseCaseError {
    constructor() {
      super('Title not available');
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
  | UseCaseErrors.UnexpectedError
  | CreateArticleCategoryErrors.SlugNotAvailableError
  | CreateArticleCategoryErrors.TitleNotAvailableError
>;

export class CreateArticleUseCase implements UseCase<CreateArticleRequestDto, Response> {
  constructor(
    private articleCommandsRepo: ArticleCommandsRepoI,
    private articleQueriesRepo: ArticleQueriesRepoI,
    private uploaderService: UploaderService,
  ) {}

  comparePropsToArticle = (props, article: ArticleDto): Result<void, UseCaseError> => {
    if (props.title === article.title) {
      return Result.fail(new CreateArticleCategoryErrors.TitleNotAvailableError());
    }

    if (props.slug === article.slug) {
      return Result.fail(new CreateArticleCategoryErrors.SlugNotAvailableError());
    }

    return Result.ok();
  };

  execute = async (request: CreateArticleRequestDto): Promise<Response> => {
    let { shouldPublish, coverFile, ...rest } = request;
    const props: any = rest;
    props.slug ??= textUtils.generateSlug(props.title);

    try {
      const article = await this.articleQueriesRepo.getArticleByProps([
        { slug: props.slug },
        { title: props.title },
      ]);

      if (article) {
        const result = this.comparePropsToArticle(props, article);

        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new UseCaseErrors.UnexpectedError());
      }

      const uploadedCover = await this.uploaderService.uploadFile(coverFile);

      props.cover = uploadedCover;
      props.status = shouldPublish ? 'published' : 'draft';

      const createdArticleOrError = await this.articleCommandsRepo.createArticle(props);

      if (createdArticleOrError.isErr()) {
        return Result.fail(new RequestValidationError(createdArticleOrError.error.message));
      }

      const createdArticle = createdArticleOrError.value;
      return Result.ok(createdArticle._id);
    } catch (error) {
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
