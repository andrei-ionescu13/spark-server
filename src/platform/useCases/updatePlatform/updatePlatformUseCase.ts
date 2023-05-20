import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { NotFoundError } from '../../../errors';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { PlatformRepoI } from '../../platformRepo';
import { UpdatePlatformRequestDto } from './updatePlatformRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class UpdatePlatformUseCase implements UseCase<UpdatePlatformRequestDto, Response> {
  constructor(private platformRepo: PlatformRepoI, private uploaderService: UploaderService) {}

  execute = async (request: UpdatePlatformRequestDto): Promise<Response> => {
    const { platformId, logoFile, ...rest } = request;
    const props: any = rest;

    try {
      const platform = await this.platformRepo.getPlatform(platformId);
      const found = !!platform;

      if (!found) {
        return left(new AppError.NotFound('Platform not found'));
      }

      if (logoFile) {
        const fileUploaded = await this.uploaderService.uploadFile(logoFile, 'platforms');
        props.logo = fileUploaded;
        await this.uploaderService.delete(platform.logo.public_id);
      }

      const updatedPlatform = await this.platformRepo.updatePlatform(platformId, props);

      return right(Result.ok<any>(updatedPlatform));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
