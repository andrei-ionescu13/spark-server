import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UploaderService } from '../../../../../services/uploaderService';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { PlatformCommandsRepoI } from '../../repo/commands';
import { PlatformQueriesRepoI } from '../../repo/queries';
import { DeletePlatformRequestDto } from './deletePlatformRequestDto';

export namespace DeletePlatformErrors {
  export class PlatformIsUsed extends UseCaseError {
    constructor() {
      super('A Product is using this platform');
    }
  }
}

type Response = Result<
  undefined,
  DeletePlatformErrors.PlatformIsUsed | UseCaseErrors.UnexpectedError
>;

export class DeletePlatformUseCase implements UseCase<DeletePlatformRequestDto, Response> {
  constructor(
    private platformCommandsRepo: PlatformCommandsRepoI,
    private platformQueriesRepo: PlatformQueriesRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: DeletePlatformRequestDto): Promise<Response> => {
    const { platformId } = request;

    try {
      const platform = await this.platformQueriesRepo.getPlatform(platformId);
      if (!platform) {
        return Result.fail(new UseCaseErrors.NotFound('Platform not found'));
      }

      await this.platformCommandsRepo.deletePlatform(platformId);
      await this.uploaderService.delete(platform.logo.publicId);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
