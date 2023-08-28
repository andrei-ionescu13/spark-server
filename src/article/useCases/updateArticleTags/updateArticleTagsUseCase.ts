import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ArticleTagRepoI } from '../../../article-tag/articleTagRepo';
import { UseCase } from '../../../use-case';
import { ArticleRepoI } from '../../articleRepo';
import { UpdateArticleTagsRequestDto } from './updateArticleTagsRequestDto';

export namespace UpdateArticleTagsErrors {
  export class ArchivedArticleError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: "Can't update an archived article" });
    }
  }
}

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class UpdateArticleTagsUseCase implements UseCase<UpdateArticleTagsRequestDto, Response> {
  constructor(private articleRepo: ArticleRepoI, private articleTagRepo: ArticleTagRepoI) {}

  execute = async (request: UpdateArticleTagsRequestDto): Promise<Response> => {
    const { articleId, tags } = request;
    try {
      const article = await this.articleRepo.getArticle(articleId);
      const articleFound = !!article;

      if (!articleFound) {
        return left(new AppError.NotFound('Article not found'));
      }

      if (article.status === 'archived') {
        return left(new UpdateArticleTagsErrors.ArchivedArticleError());
      }

      const articleTags = await this.articleTagRepo.getArticleTags(tags);

      if (tags.length !== articleTags.length) {
        return left(new AppError.NotFound('Tags not found'));
      }

      const updatedArticle = await this.articleRepo.updateArticle(articleId, { tags });
      const updated = !!updatedArticle;

      if (!updated) {
        return left(new AppError.NotFound('Article not found'));
      }
      console.log(updatedArticle.tags);
      return right(Result.ok<string>(updatedArticle.tags));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
