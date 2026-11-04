import { UseCaseErrors } from '../../../../../appError';
import { Result } from '../../../../../results';
import { UseCase } from '../../../../../useCase';
import { ArticlePopulatedDto } from '../../articleMapper';
import { ArticleQueriesRepoI } from '../../repo/queries';
import { GetArticleRequestDto } from './GetArticleRequestDto';

type Response = Result<ArticlePopulatedDto, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class GetArticleUseCase implements UseCase<GetArticleRequestDto, Response> {
  constructor(private articleQueriesRepo: ArticleQueriesRepoI) {}

  execute = async (request: GetArticleRequestDto): Promise<Response> => {
    const { articleId } = request;

    try {
      const article = await this.articleQueriesRepo.getArticle(articleId);
      if (!article) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      return Result.ok(article);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
