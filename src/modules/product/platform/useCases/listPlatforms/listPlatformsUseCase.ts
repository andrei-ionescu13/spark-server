import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { PlatformDto } from '../../platformMapper';
import { PlatformQueriesRepoI } from '../../repo/queries';
import { ListPlatformsRequestDto } from './listPlatformsRequestDto';

type Response = Result<PlatformDto[], UseCaseErrors.UnexpectedError>;

export class ListPlatformsUseCase implements UseCase<ListPlatformsRequestDto, Response> {
  constructor(private platformQueriesRepo: PlatformQueriesRepoI) {}

  execute = async (request: ListPlatformsRequestDto): Promise<Response> => {
    try {
      const platforms = await this.platformQueriesRepo.listPlatforms();
      return Result.ok(platforms);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
