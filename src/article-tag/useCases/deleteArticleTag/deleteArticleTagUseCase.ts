import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ArticleRepoI } from '../../../article/articleRepo';
import { UseCase } from '../../../use-case';
import { ArticleTagRepoI } from '../../articleTagRepo';
import { DeleteArticleTagRequestDto } from './deleteArticleTagRequestDto';

export namespace DeleteArticleTagErrors {
  export class ArticleTagInUse extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'An article is using this category' });
    }
  }
}

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteArticleTagUseCase implements UseCase<DeleteArticleTagRequestDto, Response> {
  constructor(private articleRepo: ArticleRepoI, private articleTagRepo: ArticleTagRepoI) {}

  execute = async (request: DeleteArticleTagRequestDto): Promise<Response> => {
    const { articleTagId } = request;

    try {
      const articleTag = await this.articleTagRepo.getArticleTag(articleTagId);
      const found = !!articleTag;

      if (!found) {
        return left(new AppError.NotFound('Tag not found'));
      }

      await this.articleTagRepo.deleteArticleTag(articleTagId);
      await this.articleRepo.deleteArticleTag(articleTagId);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
