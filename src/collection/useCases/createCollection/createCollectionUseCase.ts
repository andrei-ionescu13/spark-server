import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { CollectionRepoI } from '../../collectionRepo';
import { CreateCollectionRequestDto } from './createCollectionRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class CreateCollectionUseCase implements UseCase<CreateCollectionRequestDto, Response> {
  constructor(private collectionRepo: CollectionRepoI, private uploaderService: UploaderService) {}

  execute = async (request: CreateCollectionRequestDto): Promise<Response> => {
    const { coverFile, ...rest } = request;
    const props: any = rest;

    try {
      const uploadedFile = await this.uploaderService.uploadFile(coverFile);

      props.cover = uploadedFile;
      props.endDate = !!props.endDate ? props.endDate : null;

      const collection = await this.collectionRepo.createCollection(props);

      return right(Result.ok<any>(collection));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
