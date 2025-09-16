import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../../AppError';
import { Asset } from '../../../../blog/article/asset';
import { Result } from '../../../../Result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../use-case';
import { Platform } from '../../platform';
import { PlatformCommandsRepoI } from '../../repo/commands';
import { CreatePlatformRequestDto } from './createPlatformRequestDto';

type Response = Result<Platform, UseCaseErrors.UnexpectedError>;

export class CreatePlatformUseCase implements UseCase<CreatePlatformRequestDto, Response> {
  constructor(
    private platformCommandsRepo: PlatformCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: CreatePlatformRequestDto): Promise<Response> => {
    let { logoFile, ...rest } = request;

    try {
      const uploadedLogo = await this.uploaderService.uploadFile(logoFile, 'platforms');
      const logoOrError = Asset.create(uploadedLogo);
      if (logoOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(logoOrError.error.message));
      }

      const logo = logoOrError.value;
      const props = { ...rest, logo, createdAt: new Date(), _id: uuidv7() };
      const platformOrError = Platform.create(props);
      if (platformOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(platformOrError.error.message));
      }

      const platform = platformOrError.value;
      await this.platformCommandsRepo.save(platform);

      return Result.ok(platform);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
