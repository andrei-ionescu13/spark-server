import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { ArticleCommandsRepoI } from '../../../article/repo/commands';
import { ArticleTagCommandsRepoI } from '../../repo/commands';
import { ArticleTagQueriesRepoI } from '../../repo/queries';
import { DeleteArticleTagBulkRequestDto } from './deleteArticleTagBulkRequestDto';

export namespace DeleteArticleTagBulkErrors {
  export class ArticleTagInUse extends UseCaseError {
    constructor() {
      super('An article is using this category');
    }
  }
}

type Response = Result<void, UseCaseErrors.UnexpectedError>;

export class DeleteArticleTagBulkUseCase
  implements UseCase<DeleteArticleTagBulkRequestDto, Response>
{
  constructor(
    private articleRepo: ArticleCommandsRepoI,
    private articleTagQueriesRepoI: ArticleTagQueriesRepoI,
    private articleTagCommandsRepoI: ArticleTagCommandsRepoI,
  ) {}

  deleteArticleTag = async (articleTagId: string) => {
    const articleTag = await this.articleTagQueriesRepoI.getArticleTag(articleTagId);

    if (!articleTag) {
      return new UseCaseErrors.NotFound('Tag not found');
    }

    await this.articleTagCommandsRepoI.deleteArticleTag(articleTagId);
    await this.articleRepo.deleteArticleTag(articleTagId);

    return Result.ok();
  };

  execute = async (request: DeleteArticleTagBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      await Promise.all(ids.map((articleTagId) => this.deleteArticleTag(articleTagId)));

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
