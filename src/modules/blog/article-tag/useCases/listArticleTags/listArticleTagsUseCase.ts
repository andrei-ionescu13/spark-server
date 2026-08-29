import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { ArticleTag } from '../../articleTag';
import { ArticleTagDto } from '../../articleTagMapper';
import { ArticleTagQueriesRepoI } from '../../repo/queries';
import { ListArticleTagsRequestDto } from './listArticleTagsRequestDto';

type Response = Result<ArticleTagDto[], UseCaseErrors.UnexpectedError>;

export class ListArticleTagsUseCase implements UseCase<ListArticleTagsRequestDto, Response> {
  constructor(private articleTagQueriesRepo: ArticleTagQueriesRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const articleTags = await this.articleTagQueriesRepo.listArticleTags();

      return Result.ok(articleTags);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
