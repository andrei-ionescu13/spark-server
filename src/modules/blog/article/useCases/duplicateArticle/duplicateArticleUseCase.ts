import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UploaderService } from '../../../../../services/uploaderService';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { ArticleDto } from '../../articleMapper';
import { ArticleCommandsRepoI } from '../../repo/commands';
import { ArticleQueriesRepoI } from '../../repo/queries';
import { RequestValidationError, Status } from '../../status';
import { Title } from '../../title';
import { DuplicateArticleRequestDto } from './duplicateArticleRequestDto';

export namespace DuplicateArticleErrors {
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
  export class InvalidFieldError extends UseCaseError {
    constructor(message?: string) {
      super(message || 'Fields invalid');
    }
  }
}

type Response = Result<
  string,
  | DuplicateArticleErrors.InvalidFieldError
  | DuplicateArticleErrors.SlugNotAvailableError
  | DuplicateArticleErrors.TitleNotAvailableError
  | UseCaseErrors.NotFound
  | UseCaseErrors.UnexpectedError
>;

export class DuplicateArticleUseCase implements UseCase<DuplicateArticleRequestDto, Response> {
  constructor(
    private articleCommandsRepo: ArticleCommandsRepoI,
    private articleQueriesRepo: ArticleQueriesRepoI,
    private uploaderService: UploaderService,
  ) {}

  comparePropsToArticle = (
    props: Pick<DuplicateArticleRequestDto, 'slug' | 'title'>,
    article: ArticleDto,
  ): Result<
    void,
    DuplicateArticleErrors.SlugNotAvailableError | DuplicateArticleErrors.TitleNotAvailableError
  > => {
    if (props.title === article.title) {
      return Result.fail(new DuplicateArticleErrors.TitleNotAvailableError());
    }

    if (props.slug === article.slug) {
      return Result.fail(new DuplicateArticleErrors.SlugNotAvailableError());
    }

    return Result.ok();
  };

  execute = async (request: DuplicateArticleRequestDto): Promise<Response> => {
    const { articleId, ...props } = request;

    try {
      const article = await this.articleQueriesRepo.getArticle(articleId);

      if (!article) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      const articleFoundByProps = await this.articleQueriesRepo.getArticleByProps([
        { slug: props.slug },
        { title: props.title },
      ]);

      if (articleFoundByProps) {
        const compareResult = this.comparePropsToArticle(props, article);
        if (compareResult.isErr()) return Result.fail(compareResult.error);

        return Result.fail(new DuplicateArticleErrors.InvalidFieldError());
      }

      const statusOrError = Status.create({ value: 'draft' });
      const titleOrError = Title.create({ value: props.title });

      const result = Result.combine([statusOrError, titleOrError]);

      if (result.isErr()) {
        return Result.fail(new DuplicateArticleErrors.InvalidFieldError(result.error.message));
      }

      const status = statusOrError._value;
      const title = titleOrError._value;

      const { _id, ...articlePropsRest } = article;
      const articleProps = {
        ...articlePropsRest,
        slug: props.slug,
        title,
        status,
        createdAt: new Date(),
        cover: await this.uploaderService.uploadFromUrl(article.cover.url),
      };

      const articleCreatedOrError = await this.articleCommandsRepo.createArticle(articleProps);

      if (articleCreatedOrError.error) {
        return Result.fail(new RequestValidationError(articleCreatedOrError.error.message));
      }

      const articleCreated = articleCreatedOrError.value;
      return Result.ok(articleCreated._id);
    } catch (error) {
      console.error(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
