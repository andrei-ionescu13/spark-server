import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { PlatformRepoI } from '../../platformRepo';
import { CreatePlatformRequestDto } from './createPlatformRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class CreatePlatformUseCase implements UseCase<CreatePlatformRequestDto, Response> {
  constructor(private platformRepo: PlatformRepoI, private uploaderService: UploaderService) {}

  execute = async (request: CreatePlatformRequestDto): Promise<Response> => {
    const { logoFile, ...rest } = request;
    const props: any = rest;

    try {
      const uploadedLogo = await this.uploaderService.uploadFile(logoFile, 'platforms');
      props.logo = uploadedLogo;

      const platform = await this.platformRepo.createPlatform(props);

      return right(Result.ok<any>(platform));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
