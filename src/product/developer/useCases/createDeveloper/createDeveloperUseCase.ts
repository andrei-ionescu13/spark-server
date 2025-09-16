import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../../AppError';
import { Asset } from '../../../../blog/article/asset';
import { Result } from '../../../../Result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../use-case';
import { Developer } from '../../developer';
import { DeveloperCommandsRepoI } from '../../repo/commands';
import { CreateDeveloperRequestDto } from './createDeveloperRequestDto';

type Response = Result<Developer, UseCaseErrors.UnexpectedError>;

export class CreateDeveloperUseCase implements UseCase<CreateDeveloperRequestDto, Response> {
  constructor(
    private developerCommandsRepo: DeveloperCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: CreateDeveloperRequestDto): Promise<Response> => {
    let { logoFile, ...rest } = request;

    try {
      const uploadedLogo = await this.uploaderService.uploadFile(logoFile, 'developers');
      const logoOrError = Asset.create(uploadedLogo);
      if (logoOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(logoOrError.error.message));
      }

      const logo = logoOrError.value;
      const props = { ...rest, logo, createdAt: new Date(), _id: uuidv7() };
      const developerOrError = Developer.create(props);
      if (developerOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(developerOrError.error.message));
      }

      const developer = developerOrError.value;
      await this.developerCommandsRepo.save(developer);

      return Result.ok(developer);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
