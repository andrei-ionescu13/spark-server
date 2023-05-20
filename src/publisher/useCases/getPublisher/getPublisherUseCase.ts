import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { PublisherRepoI } from '../../publisherRepo';
import { GetPublisherRequestDto } from './getPublisherRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class GetPublisherUseCase implements UseCase<GetPublisherRequestDto, Response> {
  constructor(private publisherRepo: PublisherRepoI) {}

  execute = async (request: GetPublisherRequestDto): Promise<Response> => {
    const { publisherId } = request;

    try {
      const publisher = await this.publisherRepo.getPublisher(publisherId);
      const found = !!!publisher;

      if (!found) {
        return left(new AppError.NotFound('Publisher not found'));
      }

      return right(Result.ok<any>(publisher));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
