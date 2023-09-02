import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { textUtils } from '../../../utils/textUtils';
import { PublisherRepoI } from '../../publisherRepo';
import { CreatePublisherRequestDto } from './createPublisherRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class CreatePublisherUseCase implements UseCase<CreatePublisherRequestDto, Response> {
  constructor(private publisherRepo: PublisherRepoI, private uploaderService: UploaderService) {}

  execute = async (request: CreatePublisherRequestDto): Promise<Response> => {
    const { logoFile, ...rest } = request;
    const props: any = rest;
    props.slug ||= textUtils.generateSlug(props.name);

    try {
      const uploadedLogo = await this.uploaderService.uploadFile(logoFile, 'publishers');
      props.logo = uploadedLogo;

      const publisher = await this.publisherRepo.createPublisher(props);

      return right(Result.ok<any>(publisher));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
