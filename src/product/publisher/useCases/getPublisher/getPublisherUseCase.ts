import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { PublisherDto } from '../../publisherMapper';
import { PublisherQueriesRepoI } from '../../repo/queries';
import { GetPublisherRequestDto } from './getPublisherRequestDto';

type Response = Result<PublisherDto, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class GetPublisherUseCase implements UseCase<GetPublisherRequestDto, Response> {
  constructor(private publisherQueriesRepo: PublisherQueriesRepoI) {}

  execute = async (request: GetPublisherRequestDto): Promise<Response> => {
    const { publisherId } = request;

    try {
      const publisher = await this.publisherQueriesRepo.getPublisher(publisherId);
      if (!publisher) {
        return Result.fail(new UseCaseErrors.NotFound('Publisher not found'));
      }

      return Result.ok(publisher);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
