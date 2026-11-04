import { UseCaseErrors } from '../../../../../appError';
import { Asset } from '../../../../../asset';
import { Result } from '../../../../../result';
import { UploaderService } from '../../../../../services/uploaderService';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../useCaseError';
import { Article, UpdateArticleDetailsProps } from '../../domain/article';
import { ArticleDescription } from '../../domain/description';
import { ArticleMarkdown } from '../../domain/markdown';
import { ArticleTitle } from '../../domain/title';
import { ArticleCommandsRepoI } from '../../repo/commands';
import { UpdateArticleDetailsRequestDto } from './updateArticleDetailsRequestDto';

export namespace UpdateArticleDetailsErrors {
  export class ArchivedArticleError extends UseCaseError {
    constructor() {
      super("Can't update an archived article");
    }
  }
}

type Response = Result<string, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateArticleDetailsUseCase
  implements UseCase<UpdateArticleDetailsRequestDto, Response>
{
  constructor(
    private articleCommandsRepo: ArticleCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: UpdateArticleDetailsRequestDto): Promise<Response> => {
    try {
      const article = await this.articleCommandsRepo.getArticle(request.articleId);
      if (!article) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      if (article.isArchived) {
        return Result.fail(new UpdateArticleDetailsErrors.ArchivedArticleError());
      }

      const descriptionOrError = ArticleDescription.create(request.description);
      const markdownOrError = ArticleMarkdown.create(request.markdown);
      const titleOrError = ArticleTitle.create(request.title);

      const combinedResult = Result.combine([descriptionOrError, markdownOrError, titleOrError]);
      if (combinedResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(combinedResult.error.message));
      }

      const [description, markdown, title] = combinedResult.value;

      const props: UpdateArticleDetailsProps = {
        description,
        markdown,
        title,
        slug: request.slug,
      };

      if (request.file) {
        const fileUploaded = await this.uploaderService.uploadFile(request.file);
        const coverOrError = Asset.create(fileUploaded);
        if (coverOrError.isErr()) {
          return Result.fail(new UseCaseErrors.DomainValidation(coverOrError.error.message));
        }

        const cover = coverOrError.value;
        props.cover = cover;

        await this.uploaderService.delete(article.cover.publicId);
      } else {
        delete props.cover;
      }

      const updateResult = article.updateDetails(props);
      if (updateResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(updateResult.error.message));
      }

      await this.articleCommandsRepo.save(article);
      return Result.ok(article._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
