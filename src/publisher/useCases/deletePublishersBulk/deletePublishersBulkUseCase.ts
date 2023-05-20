import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { PublisherRepoI } from '../../publisherRepo';
import { DeletePublishersBulkRequestDto } from './deletePublishersBulkRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeletePublishersBulkUseCase
  implements UseCase<DeletePublishersBulkRequestDto, Response>
{
  constructor(private publisherRepo: PublisherRepoI) {}

  execute = async (request: DeletePublishersBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      await Promise.all(ids.map((id) => this.publisherRepo.deletePublisher(id)));

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
