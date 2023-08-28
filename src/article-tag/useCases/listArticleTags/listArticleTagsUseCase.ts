import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ArticleTagRepoI } from '../../articleTagRepo';
import { ListArticleTagsRequestDto } from './listArticleTagsRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class ListArticleTagsUseCase implements UseCase<ListArticleTagsRequestDto, Response> {
  constructor(private articleTagRepo: ArticleTagRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const articleTags = await this.articleTagRepo.listArticleTags();

      return right(Result.ok(articleTags));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
