import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { PlatformRepoI } from '../../platformRepo';
import { DeletePlatformsBulkRequestDto } from './deletePlatformsBulkRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeletePlatformsBulkUseCase
  implements UseCase<DeletePlatformsBulkRequestDto, Response>
{
  constructor(private platformRepo: PlatformRepoI, private uploaderService: UploaderService) {}

  deletePlatform = async (platformId: string) => {
    const platform = await this.platformRepo.getPlatform(platformId);
    const found = !!platform;

    if (!found) {
      return left(new AppError.NotFound('Platform not found'));
    }

    await this.platformRepo.deletePlatform(platformId);
    await this.uploaderService.delete(platform.logo.public_id);
  };

  execute = async (request: DeletePlatformsBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      await Promise.all(ids.map((id) => this.deletePlatform(id)));

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
