import { UseCaseErrors } from '../../../../appErrors';
import { Asset } from '../../../../assets';
import { Meta } from '../../../../meta';
import { Result } from '../../../../results';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../useCase';
import { Collection, UpdateCollectionProps } from '../../domain/collection';
import { CollectionDescription } from '../../domain/collectionDescription';
import { CollectionTitle } from '../../domain/collectionTitle';
import { CollectionCommandsRepoI } from '../../repo/commands';
import { UpdateCollectionRequestDto } from './updateCollectionRequestDto';

type Response = Result<string, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateCollectionUseCase implements UseCase<UpdateCollectionRequestDto, Response> {
  constructor(
    private collectionCommandsRepo: CollectionCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: UpdateCollectionRequestDto): Promise<Response> => {
    try {
      const collection = await this.collectionCommandsRepo.getCollection(request.collectionId);
      if (!collection) {
        return Result.fail(new UseCaseErrors.NotFound('Deal not found'));
      }

      const titleOrError = CollectionTitle.create(request.title);
      const descriptionOrError = CollectionDescription.create(request.description);
      const metaOrError = Meta.create(request.meta);
      const combinedResult = Result.combine([titleOrError, descriptionOrError, metaOrError]);
      if (combinedResult.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(combinedResult.error.message));

      const [title, description, meta] = combinedResult.value;

      const props: UpdateCollectionProps = {
        description,
        endDate: request.endDate,
        meta,
        products: request.products,
        slug: request.slug,
        startDate: request.startDate,
        title,
      };

      if (request.coverFile) {
        await this.uploaderService.delete(collection.cover.publicId);
        const uploadedCover = await this.uploaderService.uploadFile(request.coverFile);

        const coverOrError = Asset.create(uploadedCover);
        if (combinedResult.isErr())
          return Result.fail(new UseCaseErrors.DomainValidation(combinedResult.error.message));

        const cover = coverOrError.value;
        props.cover = cover;
      }

      collection.update(props);
      await this.collectionCommandsRepo.save(collection);

      return Result.ok(collection._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
