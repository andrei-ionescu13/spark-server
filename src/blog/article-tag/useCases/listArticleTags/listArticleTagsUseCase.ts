import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { ArticleTag } from '../../articleTag';
import { ArticleTagRepoI } from '../../articleTagRepo';
import { ListArticleTagsRequestDto } from './listArticleTagsRequestDto';

type Response = Result<ArticleTag[], UseCaseErrors.UnexpectedError>;

export class ListArticleTagsUseCase implements UseCase<ListArticleTagsRequestDto, Response> {
  constructor(private articleTagRepo: ArticleTagRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const articleTags = await this.articleTagRepo.listArticleTags();

      return Result.ok(articleTags);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
