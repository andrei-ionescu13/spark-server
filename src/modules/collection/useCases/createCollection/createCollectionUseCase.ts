import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../useCase';
import { Collection } from '../../collection';
import { CollectionCommandsRepoI } from '../../repo/commands';
import { CreateCollectionRequestDto } from './createCollectionRequestDto';

type Response = Result<Collection, UseCaseErrors.ValidationError | UseCaseErrors.UnexpectedError>;

export class CreateCollectionUseCase implements UseCase<CreateCollectionRequestDto, Response> {
  constructor(
    private collectionCommandsRepo: CollectionCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: CreateCollectionRequestDto): Promise<Response> => {
    const { coverFile, ...rest } = request;
    const props: any = rest;

    try {
      const uploadedFile = await this.uploaderService.uploadFile(coverFile);

      props.cover = uploadedFile;
      props.endDate = !!props.endDate ? props.endDate : null;

      const collectionOrError = Collection.create(props);

      if (collectionOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(collectionOrError.error.message));
      }

      const collection = collectionOrError.value;
      await this.collectionCommandsRepo.save(collection);

      return Result.ok(collection);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
