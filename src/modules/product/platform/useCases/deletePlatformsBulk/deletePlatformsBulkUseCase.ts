import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UploaderService } from '../../../../../services/uploaderService';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { PlatformCommandsRepoI } from '../../repo/commands';
import { PlatformQueriesRepoI } from '../../repo/queries';
import { DeletePlatformsBulkRequestDto } from './deletePlatformsBulkRequestDto';

export namespace DeletePlatformsBulkErrors {
  export class PlatformIsUsed extends UseCaseError {
    constructor() {
      super('A Product is using this platform');
    }
  }
}

type Response = Result<
  undefined,
  DeletePlatformsBulkErrors.PlatformIsUsed | UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError
>;

export class DeletePlatformsBulkUseCase
  implements UseCase<DeletePlatformsBulkRequestDto, Response>
{
  constructor(
    private platformCommandsRepo: PlatformCommandsRepoI,
    private platformQueriesRepo: PlatformQueriesRepoI,
    private uploaderService: UploaderService,
  ) {}

  deletePlatform = async (
    platformId: string,
  ): Promise<
    Result<undefined, UseCaseErrors.NotFound | DeletePlatformsBulkErrors.PlatformIsUsed>
  > => {
    const platform = await this.platformQueriesRepo.getPlatform(platformId);
    if (!platform) {
      return Result.fail(new UseCaseErrors.NotFound('Platform not found'));
    }

    await this.platformCommandsRepo.deletePlatform(platformId);
    await this.uploaderService.delete(platform.logo.publicId);

    return Result.ok();
  };

  execute = async (request: DeletePlatformsBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      const responses = await Promise.all(ids.map((id) => this.deletePlatform(id)));
      const combinedResult = Result.combine(responses);

      if (combinedResult.isErr()) {
        return Result.fail(combinedResult.error);
      }

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
