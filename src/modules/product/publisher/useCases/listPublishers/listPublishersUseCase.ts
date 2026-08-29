import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { PublisherDto } from '../../publisherMapper';
import { PublisherQueriesRepoI } from '../../repo/queries';
import { ListPublishersRequestDto } from './listPublishersRequestDto';

type Response = Result<PublisherDto[], UseCaseErrors.UnexpectedError>;

export class ListPublishersUseCase implements UseCase<ListPublishersRequestDto, Response> {
  constructor(private publisherQueriesRepo: PublisherQueriesRepoI) {}

  execute = async (request: ListPublishersRequestDto): Promise<Response> => {
    try {
      const publishers = await this.publisherQueriesRepo.listPublishers();
      return Result.ok(publishers);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
