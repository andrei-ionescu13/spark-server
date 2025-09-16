import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { DeveloperDto } from '../../developerMapper';
import { DeveloperQueriesRepoI } from '../../repo/queries';
import { GetDeveloperRequestDto } from './getDeveloperRequestDto';

type Response = Result<DeveloperDto, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class GetDeveloperUseCase implements UseCase<GetDeveloperRequestDto, Response> {
  constructor(private developerQueriesRepo: DeveloperQueriesRepoI) {}

  execute = async (request: GetDeveloperRequestDto): Promise<Response> => {
    const { developerId } = request;

    try {
      const developer = await this.developerQueriesRepo.getDeveloper(developerId);
      if (!developer) {
        return Result.fail(new UseCaseErrors.NotFound('Developer not found'));
      }

      return Result.ok(developer);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
