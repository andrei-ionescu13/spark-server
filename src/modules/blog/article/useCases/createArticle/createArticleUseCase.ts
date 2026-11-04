import { textUtils } from '../../../../../utils/textUtils';
import { UseCaseErrors } from '../../../../../appError';
import { Result } from '../../../../../result';
import { UploaderService } from '../../../../../services/uploaderService';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../useCaseError';
import { ArticleDto, ArticlePopulatedDto } from '../../articleMapper';
import { ArticleCommandsRepoI } from '../../repo/commands';
import { ArticleQueriesRepoI } from '../../repo/queries';
import { RequestValidationError, ArticleStatus } from '../../domain/status';
import { CreateArticleRequestDto } from './createArticleRequestDto';
import { Article, CreateArticleProps } from '../../domain/article';
import { ArticleTitle } from '../../domain/title';
import { ArticleDescription } from '../../domain/description';
import { ArticleMarkdown } from '../../domain/markdown';
import { Asset } from '../../../../../assets';
import { Meta } from '../../../../../meta';

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

  comparePropsToArticle = (
    props: Pick<ArticlePopulatedDto, 'title' | 'slug'>,
    article: ArticleDto,
  ): Result<void, UseCaseError> => {
    if (props.title === article.title) {
      return Result.fail(new CreateArticleCategoryErrors.TitleNotAvailableError());
    }

    if (props.slug === article.slug) {
      return Result.fail(new CreateArticleCategoryErrors.SlugNotAvailableError());
    }

    return Result.ok();
  };

  execute = async (request: CreateArticleRequestDto): Promise<Response> => {
    const { shouldPublish, coverFile } = request;
    const slug = request.slug || textUtils.generateSlug(request.title);

    try {
      const articleFound = await this.articleQueriesRepo.getArticleByProps([
        { slug: request.slug },
        { title: request.title },
      ]);

      if (articleFound) {
        const result = this.comparePropsToArticle(
          {
            slug,
            title: request.title,
          },
          articleFound,
        );

        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new UseCaseErrors.UnexpectedError());
      }

      const uploadedCover = await this.uploaderService.uploadFile(coverFile);

      const coverOrError = Asset.create(uploadedCover);
      const titleOrError = ArticleTitle.create(request.title);
      const descriptionOrError = ArticleDescription.create(request.description);
      const markdownOrError = ArticleMarkdown.create(request.markdown);
      const metaOrError = Meta.create(request.meta);
      const statusOrError = ArticleStatus.create(shouldPublish ? 'published' : 'draft');
      const combinedResult = Result.combine([
        metaOrError,
        coverOrError,
        titleOrError,
        descriptionOrError,
        markdownOrError,
        statusOrError,
      ]);

      if (combinedResult.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(combinedResult.error.message));

      const cover = coverOrError.value;
      const title = titleOrError.value;
      const description = descriptionOrError.value;
      const markdown = markdownOrError.value;
      const status = statusOrError.value;
      const meta = metaOrError.value;

      const props: CreateArticleProps = {
        title,
        description,
        markdown,
        status,
        cover,
        slug,
        meta,
        category: request.category,
        tags: request.tags,
      };
      const articleOrError = Article.create({ ...props, title, description, markdown, status });
      if (articleOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(articleOrError.error.message));
      }

      const article = articleOrError.value;
      this.articleCommandsRepo.save(article);
      return Result.ok(article._id);
    } catch (error) {
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
