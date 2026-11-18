import { UseCaseErrors } from '../../../../../appError';
import { Result } from '../../../../../result';
import { UseCase } from '../../../../../useCase';
import { PublisherDto } from '../../publisherMapper';
import { PublisherQueriesRepoI } from '../../repo/queries';

type Response = Result<PublisherDto[], UseCaseErrors.UnexpectedError>;

export class ListPublishersUseCase implements UseCase<undefined, Response> {
  constructor(private publisherQueriesRepo: PublisherQueriesRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const publishers = await this.publisherQueriesRepo.listPublishers();
      return Result.ok(publishers);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
