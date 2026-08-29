import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { ArticleDto } from '../../articleMapper';
import { ArticleQueriesRepoI } from '../../repo/queries';
import { GetArticleRequestDto } from './GetArticleRequestDto';

type Response = Result<ArticleDto, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class GetArticleUseCase implements UseCase<GetArticleRequestDto, Response> {
  constructor(private articleQueriesRepo: ArticleQueriesRepoI) {}

  execute = async (request: GetArticleRequestDto): Promise<Response> => {
    const { articleId } = request;

    try {
      const article = await this.articleQueriesRepo.getArticle(articleId);
      const found = !!article;

      if (!found) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      return Result.ok(article);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
