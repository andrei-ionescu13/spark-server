import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ArticleRepoI } from '../../articleRepo';
import { UpdateArticleStatusRequestDto } from './updateArticleStatusRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class UpdateArticleStatusUseCase
  implements UseCase<UpdateArticleStatusRequestDto, Response>
{
  constructor(private articleRepo: ArticleRepoI) {}

  execute = async (request: UpdateArticleStatusRequestDto): Promise<Response> => {
    const { articleId, status } = request;

    try {
      const article = await this.articleRepo.getArticle(articleId);
      const found = !!article;

      if (!found) {
        return left(new AppError.NotFound('Article not found'));
      }

      const updatedArticle = await this.articleRepo.updateArticle(articleId, { status });
      const updated = !!updatedArticle;

      if (!updated) {
        return left(new AppError.NotFound('Article not found'));
      }

      return right(Result.ok<string>(updatedArticle.status));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
