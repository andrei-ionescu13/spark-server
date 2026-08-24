import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { ArticleTag } from '../../articleTag';
import { ArticleTagDto } from '../../articleTagMapper';
import { ArticleTagQueryRepoI } from '../../repo/queries';
import { ListArticleTagsRequestDto } from './listArticleTagsRequestDto';

type Response = Result<ArticleTagDto[], UseCaseErrors.UnexpectedError>;

export class ListArticleTagsUseCase implements UseCase<ListArticleTagsRequestDto, Response> {
  constructor(private articleTagQueryRepo: ArticleTagQueryRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const articleTags = await this.articleTagQueryRepo.listArticleTags();

      return Result.ok(articleTags);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
