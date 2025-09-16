import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../use-case';
import { UseCaseError } from '../../../../UseCaseError';
import { Article } from '../../article';
import { ArticleCommandRepoI } from '../../repo/commands';
import { UpdateArticleDetailsRequestDto } from './updateArticleDetailsRequestDto';

export namespace UpdateArticleDetailsErrors {
  export class ArchivedArticleError extends UseCaseError {
    constructor() {
      super("Can't update an archived article");
    }
  }
}

type Response = Result<Article, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateArticleDetailsUseCase
  implements UseCase<UpdateArticleDetailsRequestDto, Response>
{
  constructor(
    private articleCommandRepo: ArticleCommandRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: UpdateArticleDetailsRequestDto): Promise<Response> => {
    const { articleId, file, ...rest } = request;
    const props: any = rest;

    try {
      const articleOrError = await this.articleCommandRepo.getArticle(articleId);

      if (articleOrError.isErr()) {
        return Result.fail(new UseCaseErrors.ValidationError(articleOrError.error.message));
      }

      const article = articleOrError.value;

      if (!article) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      if (article.isArchived()) {
        return Result.fail(new UpdateArticleDetailsErrors.ArchivedArticleError());
      }

      if (file) {
        const fileUploaded = await this.uploaderService.uploadFile(file);
        props.cover = fileUploaded;
        await this.uploaderService.delete(article.cover.publicId);
      } else {
        delete props.cover;
      }

      const updatedArticleOrError = await this.articleCommandRepo.updateArticle(articleId, props);

      if (updatedArticleOrError.isErr()) {
        return Result.fail(new UseCaseErrors.ValidationError(updatedArticleOrError.error.message));
      }

      const updatedArticle = updatedArticleOrError._value;

      if (!updatedArticle) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      return Result.ok(updatedArticle);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
