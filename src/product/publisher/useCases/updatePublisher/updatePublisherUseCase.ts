import { UseCaseErrors } from '../../../../AppError';
import { Asset } from '../../../../blog/article/asset';
import { Result } from '../../../../Result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../use-case';
import { Publisher } from '../../publisher';
import { PublisherCommandsRepoI } from '../../repo/commands';
import { UpdatePublisherRequestDto } from './updatePublisherRequestDto';

type Response = Result<
  Publisher,
  UseCaseErrors.DomainValidation | UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound
>;

export class UpdatePublisherUseCase implements UseCase<UpdatePublisherRequestDto, Response> {
  constructor(
    private publisherCommandsRepo: PublisherCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: UpdatePublisherRequestDto): Promise<Response> => {
    const { publisherId, logoFile, ...rest } = request;
    const props: { name: string; logo?: Asset } = rest;

    try {
      const publisherOrError = await this.publisherCommandsRepo.getPublisher(publisherId);
      if (publisherOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(publisherOrError.error.message));
      }

      const publisher = publisherOrError.value;
      if (!publisher) {
        return Result.fail(new UseCaseErrors.NotFound('Publisher not found'));
      }

      if (!!logoFile) {
        const fileUploaded = await this.uploaderService.uploadFile(logoFile, 'publishers');
        const logoOrError = Asset.create(fileUploaded);
        if (logoOrError.isErr()) {
          return Result.fail(new UseCaseErrors.DomainValidation(logoOrError.error.message));
        }

        const logo = logoOrError.value;
        props.logo = logo;
        await this.uploaderService.delete(publisher.logo.publicId);
      }

      publisher.update({ name: props.name, logo: props.logo });
      await this.publisherCommandsRepo.save(publisher);

      return Result.ok(publisher);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
