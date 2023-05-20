import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ArticleRepoI } from '../../articleRepo';
import { GetArticleRequestDto } from './GetArticleRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class GetArticleUseCase implements UseCase<GetArticleRequestDto, Response> {
  constructor(private articleRepo: ArticleRepoI) {}

  execute = async (request: GetArticleRequestDto): Promise<Response> => {
    const { articleId } = request;

    try {
      const article = await this.articleRepo.getArticle(articleId);
      const found = !!article;

      if (!found) {
        return left(new AppError.NotFound('Article not found'));
      }

      return right(Result.ok<any>(article));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
