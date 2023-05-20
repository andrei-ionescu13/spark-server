import { AppError } from '../../../AppError';
import { Result, Either, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { UseCase } from '../../../use-case';
import { ArticleRepoI } from '../../articleRepo';
import { UpdateArticleMetaRequestDto } from './updateArticleMetaRequestDto';

export namespace UpdateArticleMetaErrors {
  export class ArchivedArticleError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: "Can't update an archived article" });
    }
  }
}

type Response = Either<
  AppError.UnexpectedError | AppError.NotFound | UpdateArticleMetaErrors.ArchivedArticleError,
  Result<any>
>;

export class UpdateArticleMetaUseCase implements UseCase<UpdateArticleMetaRequestDto, Response> {
  constructor(private articleRepo: ArticleRepoI) {}

  execute = async (request: UpdateArticleMetaRequestDto): Promise<Response> => {
    const { articleId, ...props } = request;

    try {
      const article = await this.articleRepo.getArticle(articleId);

      const found = !!article;

      if (!found) {
        return left(new AppError.NotFound('Article not found'));
      }

      if (article.status === 'archived') {
        return left(new UpdateArticleMetaErrors.ArchivedArticleError());
      }

      const updatedArticle = await this.articleRepo.updateArticle(articleId, { meta: props });
      const updated = !!updatedArticle;

      if (!updated) {
        return left(new AppError.NotFound('Article not found'));
      }

      const { meta, updatedAt } = updatedArticle;

      return right(Result.ok<any>({ meta, updatedAt }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
