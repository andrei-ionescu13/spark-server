import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { UseCaseError } from '../../../../UseCaseError';
import { ArticleCommandRepoI } from '../../../article/repo/commands';
import { ArticleTagRepoI } from '../../articleTagRepo';
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
  constructor(private articleRepo: ArticleCommandRepoI, private articleTagRepo: ArticleTagRepoI) {}

  deleteArticleTag = async (articleTagId: string) => {
    const articleTag = await this.articleTagRepo.getArticleTag(articleTagId);
    const found = !!articleTag;

    if (!found) {
      return new UseCaseErrors.NotFound('Tag not found');
    }

    await this.articleTagRepo.deleteArticleTag(articleTagId);
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
