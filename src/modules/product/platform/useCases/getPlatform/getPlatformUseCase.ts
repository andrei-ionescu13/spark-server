import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { PlatformDto } from '../../platformMapper';
import { PlatformQueriesRepoI } from '../../repo/queries';
import { GetPlatformRequestDto } from './getPlatformRequestDto';

type Response = Result<PlatformDto, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class GetPlatformUseCase implements UseCase<GetPlatformRequestDto, Response> {
  constructor(private platformQueriesRepo: PlatformQueriesRepoI) {}

  execute = async (request: GetPlatformRequestDto): Promise<Response> => {
    const { platformId } = request;

    try {
      const platform = await this.platformQueriesRepo.getPlatform(platformId);
      if (!platform) {
        return Result.fail(new UseCaseErrors.NotFound('Platform not found'));
      }

      return Result.ok(platform);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
