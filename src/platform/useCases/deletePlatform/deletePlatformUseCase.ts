import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { NotFoundError } from '../../../errors';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { PlatformRepoI } from '../../platformRepo';
import { DeletePlatformRequestDto } from './deletePlatformRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DeletePlatformUseCase implements UseCase<DeletePlatformRequestDto, Response> {
  constructor(private platformRepo: PlatformRepoI, private uploaderService: UploaderService) {}

  execute = async (request: DeletePlatformRequestDto): Promise<Response> => {
    const { platformId } = request;

    try {
      const platform = await this.platformRepo.getPlatform(platformId);
      const found = !!platform;

      if (!found) {
        return left(new AppError.NotFound('Platform not found'));
      }

      await this.platformRepo.deletePlatform(platformId);
      await this.uploaderService.delete(platform.logo.public_id);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
