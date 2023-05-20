import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ArticleRepoI } from '../../articleRepo';
import { DeleteArticleRequestDto } from './deleteArticleRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteArticleUseCase implements UseCase<DeleteArticleRequestDto, Response> {
  constructor(private articleRepo: ArticleRepoI) {}

  execute = async (request: DeleteArticleRequestDto): Promise<Response> => {
    const { articleId } = request;

    try {
      await this.articleRepo.deleteArticle(articleId);
      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
