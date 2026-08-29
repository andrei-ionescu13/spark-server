import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { ArticleCommandsRepoI } from '../../../article/repo/commands';
import { ArticleTagCommandsRepoI } from '../../repo/commands';
import { ArticleTagQueriesRepoI } from '../../repo/queries';
import { DeleteArticleTagRequestDto } from './deleteArticleTagRequestDto';

export namespace DeleteArticleTagErrors {
  export class ArticleTagInUse extends UseCaseError {
    constructor() {
      super('An article is using this category');
    }
  }
}

type Response = Result<void, UseCaseErrors.UnexpectedError>;

export class DeleteArticleTagUseCase implements UseCase<DeleteArticleTagRequestDto, Response> {
  constructor(
    private articleCommandsRepo: ArticleCommandsRepoI,
    private articleTagQueriesRepo: ArticleTagQueriesRepoI,
    private articleTagCommandsRepo: ArticleTagCommandsRepoI,
  ) {}

  execute = async (request: DeleteArticleTagRequestDto): Promise<Response> => {
    const { articleTagId } = request;

    try {
      const articleTag = await this.articleTagQueriesRepo.getArticleTag(articleTagId);

      if (!articleTag) {
        return Result.fail(new UseCaseErrors.NotFound('Tag not found'));
      }

      await Promise.all([
        this.articleTagCommandsRepo.deleteArticleTag(articleTagId),
        this.articleCommandsRepo.deleteArticleTag(articleTagId),
      ]);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
