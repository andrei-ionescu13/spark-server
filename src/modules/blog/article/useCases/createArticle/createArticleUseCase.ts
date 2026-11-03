import { textUtils } from '../../../../../utils/textUtils';
import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../result';
import { UploaderService } from '../../../../../services/uploaderService';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { ArticleDto } from '../../articleMapper';
import { ArticleCommandsRepoI } from '../../repo/commands';
import { ArticleQueriesRepoI } from '../../repo/queries';
import { RequestValidationError, ArticleStatus } from '../../domain/status';
import { CreateArticleRequestDto } from './createArticleRequestDto';
import { Article, CreateArticleProps } from '../../domain/article';
import { ArticleTitle } from '../../domain/title';
import { ArticleDescription } from '../../domain/description';
import { ArticleMarkdown } from '../../domain/markdown';
import { Asset } from '../../../../../Asset';
import { Meta } from '../../../../../Meta';

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
    props: Pick<ArticleDto, 'title' | 'slug'>,
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
      const article = await this.articleQueriesRepo.getArticleByProps([
        { slug: request.slug },
        { title: request.title },
      ]);

      if (article) {
        const result = this.comparePropsToArticle(
          {
            slug,
            title: request.title,
          },
          article,
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
      const createdArticle = Article.create({ ...props, title, description, markdown, status });
      this.articleCommandsRepo.save(createdArticle);
      return Result.ok(createdArticle._id);
    } catch (error) {
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
