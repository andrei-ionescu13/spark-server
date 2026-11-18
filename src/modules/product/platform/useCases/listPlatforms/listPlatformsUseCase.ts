import { UseCaseErrors } from '../../../../../appError';
import { Result } from '../../../../../result';
import { UseCase } from '../../../../../useCase';
import { PlatformDto } from '../../platformMapper';
import { PlatformQueriesRepoI } from '../../repo/queries';

type Response = Result<PlatformDto[], UseCaseErrors.UnexpectedError>;

export class ListPlatformsUseCase implements UseCase<undefined, Response> {
  constructor(private platformQueriesRepo: PlatformQueriesRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const platforms = await this.platformQueriesRepo.listPlatforms();
      return Result.ok(platforms);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
