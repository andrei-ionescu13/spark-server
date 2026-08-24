import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { UseCaseError } from '../../../../UseCaseError';
import { ArticleCommandRepoI } from '../../../article/repo/commands';
import { ArticleTagCommandsRepoI } from '../../repo/commands';
import { ArticleTagQueryRepoI } from '../../repo/queries';
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
    private articleCommandRepo: ArticleCommandRepoI,
    private articleTagQueryRepo: ArticleTagQueryRepoI,
    private articleTagCommandsRepo: ArticleTagCommandsRepoI,
  ) {}

  execute = async (request: DeleteArticleTagRequestDto): Promise<Response> => {
    const { articleTagId } = request;

    try {
      const articleTag = await this.articleTagQueryRepo.getArticleTag(articleTagId);

      if (!articleTag) {
        return Result.fail(new UseCaseErrors.NotFound('Tag not found'));
      }

      await Promise.all([
        this.articleTagCommandsRepo.deleteArticleTag(articleTagId),
        this.articleCommandRepo.deleteArticleTag(articleTagId),
      ]);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
