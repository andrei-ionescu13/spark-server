import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { NotFoundError } from '../../../errors';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { PublisherRepoI } from '../../publisherRepo';
import { UpdatePublisherRequestDto } from './updatePublisherRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class UpdatePublisherUseCase implements UseCase<UpdatePublisherRequestDto, Response> {
  constructor(private publisherRepo: PublisherRepoI, private uploaderService: UploaderService) {}

  execute = async (request: UpdatePublisherRequestDto): Promise<Response> => {
    const { publisherId, logoFile, ...rest } = request;
    const props: any = rest;

    try {
      const publisher = await this.publisherRepo.getPublisher(publisherId);

      if (!publisher) {
        return left(new AppError.NotFound('Publisher not found'));
      }

      if (!!logoFile) {
        const fileUploaded = await this.uploaderService.uploadFile(logoFile, 'publishers');
        props.logo = fileUploaded;
        await this.uploaderService.delete(publisher.logo.public_id);
      }

      const updatedPublisher = await this.publisherRepo.updatePublisher(publisher._id, props);

      return right(Result.ok(updatedPublisher));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
