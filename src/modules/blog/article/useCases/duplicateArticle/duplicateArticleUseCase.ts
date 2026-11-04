import { UseCaseErrors } from '../../../../../appError';
import { Result } from '../../../../../results';
import { UploaderService } from '../../../../../services/uploaderService';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../useCaseError';
import { ArticlePopulatedDto } from '../../articleMapper';
import { ArticleCommandsRepoI } from '../../repo/commands';
import { ArticleQueriesRepoI } from '../../repo/queries';
import { RequestValidationError, ArticleStatus } from '../../domain/status';
import { ArticleTitle } from '../../domain/title';
import { DuplicateArticleRequestDto } from './duplicateArticleRequestDto';
import { Article, CreateArticleProps } from '../../domain/article';
import { ArticleDescription } from '../../domain/description';
import { ArticleMarkdown } from '../../domain/markdown';
import { Meta } from '../../../../../meta';

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
    article: ArticlePopulatedDto,
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

      const statusOrError = ArticleStatus.create('draft');
      const title = ArticleTitle.reconstitute(article.title);
      const description = ArticleDescription.reconstitute(article.description);
      const markdown = ArticleMarkdown.reconstitute(article.markdown);
      const meta = Meta.reconstitute(article.meta);

      const result = Result.combine([statusOrError]);

      if (result.isErr()) {
        return Result.fail(new DuplicateArticleErrors.InvalidFieldError(result.error.message));
      }

      const status = statusOrError.value;

      const articleProps: CreateArticleProps = {
        description,
        slug: props.slug,
        title,
        status,
        cover: await this.uploaderService.uploadFromUrl(article.cover.url),
        category: article.category._id,
        markdown,
        meta,
        tags: article.tags.map((tag) => tag._id),
      };

      const articleCreatedOrError = Article.create(articleProps);
      if (articleCreatedOrError.isErr()) {
        return Result.fail(new RequestValidationError(articleCreatedOrError.error.message));
      }

      const articleCreated = articleCreatedOrError.value;
      await this.articleCommandsRepo.save(articleCreated);
      return Result.ok(articleCreated._id);
    } catch (error) {
      console.error(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
