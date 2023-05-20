import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { ArticleRepoI } from '../../articleRepo';
import { CreateArticleRequestDto } from './createArticleRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class CreateArticleUseCase implements UseCase<CreateArticleRequestDto, Response> {
  constructor(private articleRepo: ArticleRepoI, private uploaderService: UploaderService) {}

  execute = async (request: CreateArticleRequestDto): Promise<Response> => {
    let { shouldPublish, coverFile, ...rest } = request;
    const props: any = rest;

    try {
      const uploadedCover = await this.uploaderService.uploadFile(coverFile);

      props.cover = uploadedCover;
      props.status = shouldPublish ? 'published' : 'draft';

      const article = await this.articleRepo.createArticle(props);

      return right(Result.ok(article._id));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
