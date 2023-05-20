import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { ArticleRepoI } from '../../articleRepo';
import { DuplicateArticleRequestDto } from './duplicateArticleRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DuplicateArticleUseCase implements UseCase<DuplicateArticleRequestDto, Response> {
  constructor(private articleRepo: ArticleRepoI, private uploaderService: UploaderService) {}

  execute = async (request: DuplicateArticleRequestDto): Promise<Response> => {
    const { articleId } = request;

    try {
      const article = await this.articleRepo.getArticle(articleId);
      const found = !!article;

      if (!found) {
        return left(new AppError.NotFound('Article not found'));
      }

      let { _id, ...props } = article;
      console.log(props);
      props.status = 'draft';
      props.createdAt = new Date();
      props.cover = await this.uploaderService.upload(props.cover.url);

      const articleCreated = await this.articleRepo.createArticle(props);

      return right(Result.ok<any>(articleCreated._id));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
