import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { Collection } from '../../collection';
import { CollectionCommandsRepoI } from '../../repo/commands';
import { UpdateCollectionRequestDto } from './updateCollectionRequestDto';

type Response = Result<Collection, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateCollectionUseCase implements UseCase<UpdateCollectionRequestDto, Response> {
  constructor(
    private collectionCommandsRepo: CollectionCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: UpdateCollectionRequestDto): Promise<Response> => {
    const { collectionId, coverFile, ...rest } = request;
    const props: any = rest;

    try {
      const collectionOrError = await this.collectionCommandsRepo.getCollection(collectionId);
      if (collectionOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(collectionOrError.error.message));
      }

      const collection = collectionOrError.value;
      if (!collection) {
        return Result.fail(new UseCaseErrors.NotFound('Collection not found'));
      }

      if (coverFile) {
        await this.uploaderService.delete(collection.cover.publicId);
        const uploadedCover = await this.uploaderService.uploadFile(coverFile);
        props.cover = uploadedCover;
      }

      props.endDate = !!props.endDate ? props.endDate : null;

      const updateResult = collection.update(props);
      if (updateResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(updateResult.error.message));
      }

      return Result.ok(collection);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
