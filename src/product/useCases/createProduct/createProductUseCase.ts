import { v7 as uuidv7 } from 'uuid';
import { textUtils } from '../../../../utils/textUtils';
import { UseCaseErrors } from '../../../AppError';
import { Key } from '../../../key/key';
import { KeyAvailability } from '../../../key/keyAvailability';
import { KeyStatus } from '../../../key/keyStatus';
import { KeyValue } from '../../../key/keyValue';
import { KeyCommandsRepoI } from '../../../key/repo/commands';
import { KeyQueriesRepoI } from '../../../key/repo/queries';
import { Result } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { UseCaseError } from '../../../UseCaseError';
import { DeveloperQueriesRepoI } from '../../developer/repo/queries';
import { FeatureQueriesRepoI } from '../../feature/repo/queries';
import { GenreQueriesRepoI } from '../../genre/repo/queries';
import { OperatingSystemQueriesRepoI } from '../../operatingSystem/repo/queries';
import { Product } from '../../product';
import { PublisherQueriesRepoI } from '../../publisher/repo/queries';
import { ProductCommandsRepoI } from '../../repo/commands';
import { ProductQueriesRepoI } from '../../repo/queries';
import { CreateProductRequestDto } from './createProductRequestDto';
export namespace CreateProductErrors {
  export class KeyForPlatformExists extends UseCaseError {
    constructor() {
      super('One or more keys could not be added');
    }
  }
  export class TitleNotAvailableError extends UseCaseError {
    constructor() {
      super('Title not available');
    }
  }

  export class SlugNotAvailableError extends UseCaseError {
    constructor() {
      super('Slug not available');
    }
  }

  export class FieldsNotAvailable extends UseCaseError {
    constructor() {
      super('Fields not available');
    }
  }
}

type Response = Result<
  string,
  | CreateProductErrors.FieldsNotAvailable
  | CreateProductErrors.KeyForPlatformExists
  | CreateProductErrors.SlugNotAvailableError
  | CreateProductErrors.TitleNotAvailableError
  | UseCaseErrors.DomainValidation
  | UseCaseErrors.NotFound
>;

export class CreateProductUseCase implements UseCase<CreateProductRequestDto, Response> {
  constructor(
    private productCommandsRepo: ProductCommandsRepoI,
    private productQueriesRepo: ProductQueriesRepoI,
    private genreQueriesRepo: GenreQueriesRepoI,
    private publisherQueriesRepo: PublisherQueriesRepoI,
    private developerQueriesRepo: DeveloperQueriesRepoI,
    private featureQueriesRepo: FeatureQueriesRepoI,
    private operatingSystemQueriesRepo: OperatingSystemQueriesRepoI,
    private keyCommandsRepo: KeyCommandsRepoI,
    private keyQueriesRepo: KeyQueriesRepoI,
    private uploaderService: UploaderService,
  ) {}

  comparePropsToProduct = (
    props,
    article,
  ): Result<
    undefined,
    CreateProductErrors.TitleNotAvailableError | CreateProductErrors.SlugNotAvailableError
  > => {
    if (props.title === article.title) {
      return Result.fail(new CreateProductErrors.TitleNotAvailableError());
    }

    if (props.slug === article.slug) {
      return Result.fail(new CreateProductErrors.SlugNotAvailableError());
    }

    return Result.ok();
  };

  createKey = async (
    product: Product,
    value: string,
  ): Promise<
    Result<
      Key,
      | UseCaseErrors.DomainValidation
      | UseCaseErrors.NotFound
      | CreateProductErrors.KeyForPlatformExists
    >
  > => {
    const keyFound = await this.keyQueriesRepo.getKeyByValue(value);

    if (keyFound) {
      const products = await this.productQueriesRepo.searchProductsByKeys(value);
      let isSamePlatform = false;

      if (products.length) {
        for (const _product of products) {
          if (_product.platform._id.toString() === product.platform) {
            isSamePlatform = true;
            break;
          }
        }
      }

      if (isSamePlatform) {
        return Result.fail(new CreateProductErrors.KeyForPlatformExists());
      }
    }

    const keyValueOrError = KeyValue.create(value);
    const availabilityOrError = KeyAvailability.create();
    const statusOrError = KeyStatus.create();

    const valueObjectsResult = Result.combine([
      keyValueOrError,
      availabilityOrError,
      statusOrError,
    ]);

    if (valueObjectsResult.isErr()) {
      return Result.fail(new UseCaseErrors.DomainValidation(valueObjectsResult.error.message));
    }

    const keyValue = keyValueOrError.value;
    const availability = availabilityOrError.value;
    const status = statusOrError.value;

    const keyOrError = Key.create({
      product: product._id,
      availability,
      status,
      value: keyValue,
      _id: uuidv7(),
    });

    if (keyOrError.isErr()) {
      return Result.fail(new UseCaseErrors.DomainValidation(keyOrError.error.message));
    }

    const key = keyOrError.value;
    const addKeyResult = product.addKey(key._id);

    if (addKeyResult.isErr()) {
      return Result.fail(new UseCaseErrors.DomainValidation(addKeyResult.error.message));
    }

    return Result.ok(key);
  };

  applyGuard = async (props): Promise<Result<undefined, UseCaseErrors.NotFound>> => {
    const result = await Promise.all([
      this.publisherQueriesRepo.getPublisher(props.publisher),
      this.developerQueriesRepo.getDevelopers(props.developers),
      this.genreQueriesRepo.getGenres(props.genres),
      this.featureQueriesRepo.getFeatures(props.features),
      this.operatingSystemQueriesRepo.getOperatingSystems(props.os),
    ]);

    const [publisher, developers, genres, features, operatingSystems] = result;

    const publisherFound = !!publisher;

    if (!publisherFound) {
      return Result.fail(new UseCaseErrors.NotFound('Publisher not found'));
    }

    if (developers.length !== props.developers.length) {
      return Result.fail(new UseCaseErrors.NotFound('Developer not found'));
    }

    if (genres.length !== props.genres.length) {
      return Result.fail(new UseCaseErrors.NotFound('Genre not found'));
    }

    if (features.length !== props.features.length) {
      return Result.fail(new UseCaseErrors.NotFound('Feature not found'));
    }

    if (operatingSystems.length !== props.os.length) {
      return Result.fail(new UseCaseErrors.NotFound('Operating System not found'));
    }

    return Result.ok();
  };

  execute = async (request: CreateProductRequestDto): Promise<Response> => {
    const { shouldPublish, coverFile, imageFiles, keysFile, ...rest } = request;
    const props: any = rest;
    props.status = shouldPublish ? 'published' : 'draft';
    props.slug ??= textUtils.generateSlug(props.title);

    try {
      const foundProduct = await this.productQueriesRepo.getProductByProps([
        { slug: props.slug },
        { title: props.title },
      ]);

      if (foundProduct) {
        const comparisonResult = this.comparePropsToProduct(props, foundProduct);
        if (comparisonResult.isErr()) {
          return Result.fail(comparisonResult.error);
        }

        return Result.fail(new CreateProductErrors.FieldsNotAvailable());
      }

      const guardResult = await this.applyGuard(props);

      if (guardResult.isErr()) {
        return Result.fail(guardResult.error);
      }

      const uploadedCover = await this.uploaderService.uploadFile(coverFile, 'products');
      const uploadedImages = await Promise.all(
        imageFiles.map(async (image) => ({
          ...(await this.uploaderService.uploadFile(image, 'products')),
          originalname: image.originalname,
        })),
      );

      props.cover = uploadedCover;
      props.images = uploadedImages.map((image) => {
        const { originalname, ...rest } = image;
        return rest;
      });

      props.selectedImages = uploadedImages
        .filter((image) => props.selectedImages.includes(image.originalname))
        .map((image) => {
          const { originalname, ...rest } = image;
          return rest;
        });

      const productOrError = Product.create(props);

      if (productOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(productOrError.error.message));
      }

      const product = productOrError.value;
      const keyValues = keysFile.buffer
        .toString()
        .split('\n')
        .map((key) => key.trim());

      const results = await Promise.all(keyValues.map((key) => this.createKey(product, key)));
      const combinedResult = Result.combine(results);

      if (combinedResult.isErr()) {
        return Result.fail(combinedResult.error);
      }

      const keys = results.map((result) => result.value);
      await this.productCommandsRepo.save(product);
      await Promise.all(keys.map((key) => this.keyCommandsRepo.save(key)));

      return Result.ok(product._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
