import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { ArticleCommandsRepoI } from '../../repo/commands';
import { DeleteArticleRequestDto } from './deleteArticleRequestDto';

type Response = Result<void, UseCaseErrors.UnexpectedError>;

export class DeleteArticleUseCase implements UseCase<DeleteArticleRequestDto, Response> {
  constructor(private articleCommandsRepo: ArticleCommandsRepoI) {}

  execute = async (request: DeleteArticleRequestDto): Promise<Response> => {
    const { articleId } = request;

    try {
      await this.articleCommandsRepo.deleteArticle(articleId);
      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
