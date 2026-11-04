import { UseCaseErrors } from '../../../../../appErrors';
import { Asset } from '../../../../../assets';
import { Result } from '../../../../../results';
import { UploaderService } from '../../../../../services/uploaderService';
import { UseCase } from '../../../../../useCase';
import { Developer } from '../../domain/developer';
import { DeveloperCommandsRepoI } from '../../repo/commands';
import { UpdateDeveloperRequestDto } from './updateDeveloperRequestDto';

type Response = Result<
  Developer,
  UseCaseErrors.DomainValidation | UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound
>;

export class UpdateDeveloperUseCase implements UseCase<UpdateDeveloperRequestDto, Response> {
  constructor(
    private developerCommandsRepo: DeveloperCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: UpdateDeveloperRequestDto): Promise<Response> => {
    const { developerId, logoFile, ...rest } = request;
    const props: { name: string; logo?: Asset } = rest;

    try {
      const developer = await this.developerCommandsRepo.getDeveloper(developerId);
      if (!developer) {
        return Result.fail(new UseCaseErrors.NotFound('Developer not found'));
      }

      if (!!logoFile) {
        const fileUploaded = await this.uploaderService.uploadFile(logoFile, 'developers');
        const logoOrError = Asset.create(fileUploaded);
        if (logoOrError.isErr()) {
          return Result.fail(new UseCaseErrors.DomainValidation(logoOrError.error.message));
        }

        const logo = logoOrError.value;
        props.logo = logo;
        await this.uploaderService.delete(developer.logo.publicId);
      }

      developer.update({ name: props.name, logo: props.logo, slug: request.slug });
      await this.developerCommandsRepo.save(developer);

      return Result.ok(developer);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
