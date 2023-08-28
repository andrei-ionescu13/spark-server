import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { ArticleRepoI } from '../../articleRepo';
import { DuplicateArticleRequestDto } from './duplicateArticleRequestDto';

export namespace DuplicateArticleErrors {
  export class TitleNotAvailableError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Title not available' });
    }
  }

  export class SlugNotAvailableError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Slug not available' });
    }
  }
}

type Response = Either<
  | AppError.UnexpectedError
  | AppError.NotFound
  | DuplicateArticleErrors.SlugNotAvailableError
  | DuplicateArticleErrors.TitleNotAvailableError,
  Result<any>
>;

export class DuplicateArticleUseCase implements UseCase<DuplicateArticleRequestDto, Response> {
  constructor(private articleRepo: ArticleRepoI, private uploaderService: UploaderService) {}

  comparePropsToArticle = (props, article): Result<UseCaseError> => {
    if (props.title === article.title) {
      return new DuplicateArticleErrors.TitleNotAvailableError();
    }

    if (props.slug === article.slug) {
      return new DuplicateArticleErrors.SlugNotAvailableError();
    }

    return new AppError.UnexpectedError();
  };

  execute = async (request: DuplicateArticleRequestDto): Promise<Response> => {
    const { articleId, ...props } = request;

    try {
      const articleToDuplicate = await this.articleRepo.getArticle(articleId);
      const articleToDuplicateFound = !!articleToDuplicate;

      if (!articleToDuplicateFound) {
        return left(new AppError.NotFound('Article not found'));
      }

      const existingArticle = await this.articleRepo.getArticleByProps([
        { slug: props.slug },
        { title: props.title },
      ]);
      const articleExists = !!existingArticle;

      if (articleExists) {
        return left(this.comparePropsToArticle(props, existingArticle));
      }

      let { _id, ...articleProps } = articleToDuplicate;

      articleProps = {
        ...articleProps,
        ...props,
      };
      articleProps.status = 'draft';
      articleProps.createdAt = new Date();
      articleProps.cover = await this.uploaderService.upload(articleProps.cover.url);

      const articleCreated = await this.articleRepo.createArticle(articleProps);

      return right(Result.ok<any>(articleCreated._id));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
