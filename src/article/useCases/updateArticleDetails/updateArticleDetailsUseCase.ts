import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ValidationError, ForbiddenError } from '../../../errors';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { ArticleRepoI } from '../../articleRepo';
import { UpdateArticleDetailsRequestDto } from './updateArticleDetailsRequestDto';

export namespace UpdateArticleDetailsErrors {
  export class ArchivedArticleError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: "Can't update an archived article" });
    }
  }
}

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class UpdateArticleDetailsUseCase
  implements UseCase<UpdateArticleDetailsRequestDto, Response>
{
  constructor(private articleRepo: ArticleRepoI, private uploaderService: UploaderService) {}

  execute = async (request: UpdateArticleDetailsRequestDto): Promise<Response> => {
    const { articleId, file, ...rest } = request;
    const props: any = rest;
    // const { error } = updateArticleDetailsSchema.validate({
    //   ...props,
    //   cover: props.cover || req?.file,
    // });

    // if (error) {
    //   next(new ValidationError(error.message));
    //   return;
    // }

    try {
      const article = await this.articleRepo.getArticle(articleId);

      if (!article) {
        return left(new AppError.NotFound('Article not found'));
      }

      if (article.status === 'archived') {
        return left(new UpdateArticleDetailsErrors.ArchivedArticleError());
      }

      if (file) {
        const fileUploaded = await this.uploaderService.uploadFile(file);
        props.cover = fileUploaded;
        await this.uploaderService.delete(article.cover.public_id);
      } else {
        delete props.cover;
      }

      const updatedArticle = await this.articleRepo.updateArticle(articleId, props);

      if (!updatedArticle) {
        return left(new AppError.NotFound('Article not found'));
      }

      return right(Result.ok<any>(updatedArticle));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
