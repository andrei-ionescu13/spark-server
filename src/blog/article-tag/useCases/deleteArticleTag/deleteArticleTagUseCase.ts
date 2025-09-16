import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { UseCaseError } from '../../../../UseCaseError';
import { ArticleCommandRepoI } from '../../../article/repo/commands';
import { ArticleTagRepoI } from '../../articleTagRepo';
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
    private articleTagRepo: ArticleTagRepoI,
  ) {}

  execute = async (request: DeleteArticleTagRequestDto): Promise<Response> => {
    const { articleTagId } = request;

    try {
      const articleTag = await this.articleTagRepo.getArticleTag(articleTagId);
      const found = !!articleTag;

      if (!found) {
        return Result.fail(new UseCaseErrors.NotFound('Tag not found'));
      }

      await this.articleTagRepo.deleteArticleTag(articleTagId);
      await this.articleCommandRepo.deleteArticleTag(articleTagId);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
