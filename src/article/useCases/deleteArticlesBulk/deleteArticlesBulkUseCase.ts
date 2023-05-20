import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ArticleRepoI } from '../../articleRepo';
import { DeleteArticlesBulkRequestDto } from './deleteArticlesBulkRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteArticlesBulkUseCase implements UseCase<DeleteArticlesBulkRequestDto, Response> {
  constructor(private articleRepo: ArticleRepoI) {}

  execute = async (request: DeleteArticlesBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      await Promise.all(ids.map((id) => this.articleRepo.deleteArticle(id)));

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
