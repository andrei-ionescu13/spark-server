import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { PublisherRepoI } from '../../publisherRepo';
import { ListPublishersRequestDto } from './listPublishersRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class ListPublishersUseCase implements UseCase<ListPublishersRequestDto, Response> {
  constructor(private publisherRepo: PublisherRepoI) {}

  execute = async (request: ListPublishersRequestDto): Promise<Response> => {
    try {
      const publishers = await this.publisherRepo.listPublishers();

      return right(Result.ok<any>(publishers));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
