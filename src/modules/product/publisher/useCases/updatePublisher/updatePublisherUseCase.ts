import { UseCaseErrors } from '../../../../../appErrors';
import { UploaderService } from '../../../../../services/uploaderService';
import { UseCase } from '../../../../../useCase';
import { Publisher } from '../../domain/publisher';
import { PublisherCommandsRepoI } from '../../repo/commands';
import { UpdatePublisherRequestDto } from './updatePublisherRequestDto';
import { Result } from '../../../../../results';
import { Asset } from '../../../../../assets';

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
    const props: { name: string; logo?: Asset; slug } = rest;

    try {
      const publisher = await this.publisherCommandsRepo.getPublisher(publisherId);
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

      publisher.update({ name: props.name, logo: props.logo, slug: props.slug });
      await this.publisherCommandsRepo.save(publisher);

      return Result.ok(publisher);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
