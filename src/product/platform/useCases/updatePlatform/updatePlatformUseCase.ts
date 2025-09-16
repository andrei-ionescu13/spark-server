import { UseCaseErrors } from '../../../../AppError';
import { Asset } from '../../../../blog/article/asset';
import { Result } from '../../../../Result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../use-case';
import { Platform } from '../../platform';
import { PlatformCommandsRepoI } from '../../repo/commands';
import { UpdatePlatformRequestDto } from './updatePlatformRequestDto';

type Response = Result<
  Platform,
  UseCaseErrors.DomainValidation | UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound
>;

export class UpdatePlatformUseCase implements UseCase<UpdatePlatformRequestDto, Response> {
  constructor(
    private platformCommandsRepo: PlatformCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: UpdatePlatformRequestDto): Promise<Response> => {
    const { platformId, logoFile, ...rest } = request;
    const props: { name: string; url: string; logo?: Asset } = rest;

    try {
      const platformOrError = await this.platformCommandsRepo.getPlatform(platformId);
      if (platformOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(platformOrError.error.message));
      }

      const platform = platformOrError.value;
      if (!platform) {
        return Result.fail(new UseCaseErrors.NotFound('Platform not found'));
      }

      if (!!logoFile) {
        const fileUploaded = await this.uploaderService.uploadFile(logoFile, 'platforms');
        const logoOrError = Asset.create(fileUploaded);
        if (logoOrError.isErr()) {
          return Result.fail(new UseCaseErrors.DomainValidation(logoOrError.error.message));
        }

        const logo = logoOrError.value;
        props.logo = logo;
        await this.uploaderService.delete(platform.logo.publicId);
      }

      platform.update({ name: props.name, url: props.url, logo: props.logo });
      await this.platformCommandsRepo.save(platform);

      return Result.ok(platform);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
