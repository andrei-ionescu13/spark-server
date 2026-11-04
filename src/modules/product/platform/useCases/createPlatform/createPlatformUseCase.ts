import { UseCaseErrors } from '../../../../../appError';
import { UploaderService } from '../../../../../services/uploaderService';
import { UseCase } from '../../../../../useCase';
import { Platform, PlatformCreateProps } from '../../domain/platform';
import { PlatformCommandsRepoI } from '../../repo/commands';
import { CreatePlatformRequestDto } from './createPlatformRequestDto';
import { Result } from '../../../../../result';
import { Asset } from '../../../../../asset';

type Response = Result<Platform, UseCaseErrors.UnexpectedError>;

export class CreatePlatformUseCase implements UseCase<CreatePlatformRequestDto, Response> {
  constructor(
    private platformCommandsRepo: PlatformCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: CreatePlatformRequestDto): Promise<Response> => {
    try {
      const uploadedLogo = await this.uploaderService.uploadFile(request.logoFile, 'platforms');
      const logoOrError = Asset.create(uploadedLogo);
      if (logoOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(logoOrError.error.message));
      }

      const logo = logoOrError.value;
      const props: PlatformCreateProps = {
        logo,
        name: request.name,
        url: request.url,
      };

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
