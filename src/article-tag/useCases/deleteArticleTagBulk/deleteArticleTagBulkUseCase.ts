import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ArticleRepoI } from '../../../article/articleRepo';
import { UseCase } from '../../../use-case';
import { ArticleTagRepoI } from '../../articleTagRepo';
import { DeleteArticleTagBulkRequestDto } from './deleteArticleTagBulkRequestDto';

export namespace DeleteArticleTagBulkErrors {
  export class ArticleTagInUse extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'An article is using this category' });
    }
  }
}

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteArticleTagBulkUseCase
  implements UseCase<DeleteArticleTagBulkRequestDto, Response>
{
  constructor(private articleRepo: ArticleRepoI, private articleTagRepo: ArticleTagRepoI) {}

  deleteArticleTag = async (articleTagId: string) => {
    const articleTag = await this.articleTagRepo.getArticleTag(articleTagId);
    const found = !!articleTag;

    if (!found) {
      return left(new AppError.NotFound('Tag not found'));
    }

    await this.articleTagRepo.deleteArticleTag(articleTagId);
    await this.articleRepo.deleteArticleTag(articleTagId);

    return right(Result.ok());
  };

  execute = async (request: DeleteArticleTagBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      await Promise.all(ids.map((articleTagId) => this.deleteArticleTag(articleTagId)));

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
