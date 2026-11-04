import { UseCaseErrors } from '../../../../appError';
import { Asset } from '../../../../asset';
import { Meta } from '../../../../meta';
import { Result } from '../../../../results';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../useCase';
import { Collection, CollectionCreateProps } from '../../domain/collection';
import { CollectionDescription } from '../../domain/collectionDescription';
import { CollectionTitle } from '../../domain/collectionTitle';
import { CollectionCommandsRepoI } from '../../repo/commands';
import { CreateCollectionRequestDto } from './createCollectionRequestDto';

type Response = Result<Collection, UseCaseErrors.ValidationError | UseCaseErrors.UnexpectedError>;

export class CreateCollectionUseCase implements UseCase<CreateCollectionRequestDto, Response> {
  constructor(
    private collectionCommandsRepo: CollectionCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: CreateCollectionRequestDto): Promise<Response> => {
    try {
      const coverFile = await this.uploaderService.uploadFile(request.coverFile);
      const coverOrError = Asset.create(coverFile);
      const titleOrError = CollectionTitle.create(request.title);
      const descriptionOrError = CollectionDescription.create(request.description);
      const metaOrError = Meta.create(request.meta);

      const combinedResult = Result.combine([
        coverOrError,
        titleOrError,
        descriptionOrError,
        metaOrError,
      ]);
      if (combinedResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(combinedResult.error.message));
      }

      const [cover, title, description, meta] = combinedResult.value;

      const props: CollectionCreateProps = {
        cover,
        description,
        endDate: request.endDate,
        meta,
        products: request.products,
        startDate: request.startDate,
        title,
        slug: request.slug,
      };
      const collectionOrError = Collection.create(props);
      if (collectionOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(collectionOrError.error.message));
      }

      const collection = collectionOrError.value;
      console.log(collection);
      await this.collectionCommandsRepo.save(collection);

      return Result.ok(collection);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
