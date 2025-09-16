import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../../AppError';
import { Asset } from '../../../../blog/article/asset';
import { Result } from '../../../../Result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../use-case';
import { Publisher } from '../../publisher';
import { PublisherCommandsRepoI } from '../../repo/commands';
import { CreatePublisherRequestDto } from './createPublisherRequestDto';

type Response = Result<Publisher, UseCaseErrors.UnexpectedError>;

export class CreatePublisherUseCase implements UseCase<CreatePublisherRequestDto, Response> {
  constructor(
    private publisherCommandsRepo: PublisherCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: CreatePublisherRequestDto): Promise<Response> => {
    let { logoFile, ...rest } = request;

    try {
      const uploadedLogo = await this.uploaderService.uploadFile(logoFile, 'publishers');
      const logoOrError = Asset.create(uploadedLogo);
      if (logoOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(logoOrError.error.message));
      }

      const logo = logoOrError.value;
      const props = { ...rest, logo, createdAt: new Date(), _id: uuidv7() };
      const publisherOrError = Publisher.create(props);
      if (publisherOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(publisherOrError.error.message));
      }

      const publisher = publisherOrError.value;
      await this.publisherCommandsRepo.save(publisher);

      return Result.ok(publisher);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
