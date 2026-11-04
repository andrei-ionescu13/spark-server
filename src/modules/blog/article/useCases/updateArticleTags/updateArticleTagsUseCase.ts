import { UseCaseErrors } from '../../../../../appError';
import { Result } from '../../../../../result';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../useCaseError';
import { ArticleTagQueriesRepoI } from '../../../article-tag/repo/queries';
import { ArticleCommandsRepoI } from '../../repo/commands';
import { UpdateArticleTagsRequestDto } from './updateArticleTagsRequestDto';

export namespace UpdateArticleTagsErrors {
  export class ArchivedArticleError extends UseCaseError {
    constructor() {
      super("Can't update an archived article");
    }
  }
}

type Response = Result<string[], UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateArticleTagsUseCase implements UseCase<UpdateArticleTagsRequestDto, Response> {
  constructor(
    private articleCommandsRepo: ArticleCommandsRepoI,
    private articleTagQueriesRepo: ArticleTagQueriesRepoI,
  ) {}

  execute = async (request: UpdateArticleTagsRequestDto): Promise<Response> => {
    const { articleId, tags } = request;

    try {
      const article = await this.articleCommandsRepo.getArticle(articleId);
      if (!article) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      if (article.isArchived) {
        return Result.fail(new UpdateArticleTagsErrors.ArchivedArticleError());
      }

      const articleTags = await this.articleTagQueriesRepo.getArticleTags(tags);
      if (tags.length !== articleTags.length) {
        return Result.fail(new UseCaseErrors.NotFound('Tags not found'));
      }

      const articleTagIds = articleTags.map((tag) => tag._id);
      const updateResult = article.updateTags(articleTagIds);
      if (updateResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(updateResult.error.message));
      }

      await this.articleCommandsRepo.save(article);
      return Result.ok(articleTagIds);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
