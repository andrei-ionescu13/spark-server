import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { NotFoundError } from '../../../errors';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { CollectionRepoI } from '../../collectionRepo';
import { UpdateCollectionRequestDto } from './updateCollectionRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class UpdateCollectionUseCase implements UseCase<UpdateCollectionRequestDto, Response> {
  constructor(private collectionRepo: CollectionRepoI, private uploaderService: UploaderService) {}

  execute = async (request: UpdateCollectionRequestDto): Promise<Response> => {
    const { collectionId, coverFile, ...rest } = request;
    const props: any = rest;

    try {
      const collection = await this.collectionRepo.getCollection(collectionId);
      const found = !!collection;

      if (!found) {
        return left(new AppError.NotFound('Collection not found'));
      }

      if (coverFile) {
        await this.uploaderService.delete(collection.cover.public_id);
        const uploadedCover = await this.uploaderService.uploadFile(coverFile);
        props.cover = uploadedCover;
      }

      props.endDate = !!props.endDate ? props.endDate : null;

      const updatedCollection = await this.collectionRepo.updateCollection(collectionId, props);

      return right(Result.ok(updatedCollection));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
