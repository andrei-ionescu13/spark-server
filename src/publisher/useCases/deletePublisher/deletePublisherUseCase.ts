import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { PublisherRepoI } from '../../publisherRepo';
import { DeletePublisherRequestDto } from './deletePublisherRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeletePublisherUseCase implements UseCase<DeletePublisherRequestDto, Response> {
  constructor(private publisherRepo: PublisherRepoI, private uploaderService: UploaderService) {}

  execute = async (request: DeletePublisherRequestDto): Promise<Response> => {
    const { publisherId } = request;

    try {
      const publisher = await this.publisherRepo.getPublisher(publisherId);
      const found = !!publisher;

      if (!found) {
        return left(new AppError.NotFound('Publisher not found'));
      }

      await this.publisherRepo.deletePublisher(publisherId);
      await this.uploaderService.delete(publisher.logo.public_id);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
