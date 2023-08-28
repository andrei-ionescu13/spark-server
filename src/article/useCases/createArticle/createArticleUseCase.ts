import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { textUtils } from '../../../utils/textUtils';
import { ArticleRepoI } from '../../articleRepo';
import { CreateArticleRequestDto } from './createArticleRequestDto';

export namespace CreateArticleCategoryErrors {
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
  | CreateArticleCategoryErrors.SlugNotAvailableError
  | CreateArticleCategoryErrors.TitleNotAvailableError,
  Result<any>
>;

export class CreateArticleUseCase implements UseCase<CreateArticleRequestDto, Response> {
  constructor(private articleRepo: ArticleRepoI, private uploaderService: UploaderService) {}

  comparePropsToArticle = (props, article): Result<UseCaseError> => {
    if (props.title === article.title) {
      return new CreateArticleCategoryErrors.TitleNotAvailableError();
    }

    if (props.slug === article.slug) {
      return new CreateArticleCategoryErrors.SlugNotAvailableError();
    }

    return new AppError.UnexpectedError();
  };

  execute = async (request: CreateArticleRequestDto): Promise<Response> => {
    let { shouldPublish, coverFile, ...rest } = request;
    const props: any = rest;
    props.slug ??= textUtils.generateSlug(props.title);

    try {
      const existingArticle = await this.articleRepo.getArticleByProps([
        { slug: props.slug },
        { title: props.title },
      ]);
      const articleExists = !!existingArticle;

      if (articleExists) {
        return left(this.comparePropsToArticle(props, existingArticle));
      }

      const uploadedCover = await this.uploaderService.uploadFile(coverFile);

      props.cover = uploadedCover;
      props.status = shouldPublish ? 'published' : 'draft';
      console.log(props);
      const article = await this.articleRepo.createArticle(props);

      return right(Result.ok(article._id));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  };
}
