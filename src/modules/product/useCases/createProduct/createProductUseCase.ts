import { v7 as uuidv7 } from 'uuid';
import { textUtils } from '../../../../utils/textUtils';
import { UseCaseErrors } from '../../../../appError';
import { Key } from '../../../key/domain/key';
import { KeyAvailability } from '../../../key/domain/keyAvailability';
import { KeyStatus } from '../../../key/domain/keyStatus';
import { KeyValue } from '../../../key/domain/keyValue';
import { KeyCommandsRepoI } from '../../../key/repo/commands';
import { KeyQueriesRepoI } from '../../../key/repo/queries';
import { Result } from '../../../../result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../useCase';
import { UseCaseError } from '../../../../useCaseError';
import { DeveloperQueriesRepoI } from '../../developer/repo/queries';
import { FeatureQueriesRepoI } from '../../feature/repo/queries';
import { GenreQueriesRepoI } from '../../genre/repo/queries';
import { OperatingSystemQueriesRepoI } from '../../operatingSystem/repo/queries';
import { Product, ProductCreateProps } from '../../domain/product';
import { PublisherQueriesRepoI } from '../../publisher/repo/queries';
import { ProductCommandsRepoI } from '../../repo/commands';
import { ProductQueriesRepoI } from '../../repo/queries';
import { CreateProductRequestDto } from './createProductRequestDto';
import { ProductStatus } from '../../domain/productStatus';
import { Asset } from '../../../../asset';
import { ProductRating } from '../../domain/productRating';
import { ProductPrice } from '../../domain/productPrice';
import { ProductMarkdown } from '../../domain/productMarkdown';
import { ProductRequirements } from '../../domain/productRequirements';
import { ProductLink } from '../../domain/productLink';
import { Meta } from '../../../../meta';
import { ProductTitle } from '../../domain/productTitle';
import { DomainValidationError } from '../../../blog/article/domain/status';

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

  checkForExistingProduct = async (slug: string, title: string) => {
    const product = await this.productQueriesRepo.getProductByProps([{ slug }, { title }]);

    if (product) {
      const result = this.comparePropsToProduct({ slug, title }, product);
      if (result.isErr()) {
        return Result.fail(result.error);
      }

      return Result.fail(new CreateProductErrors.FieldsNotAvailable());
    }

    return Result.ok();
  };

  async uploadAssets(
    coverFile,
    imageFiles,
  ): Promise<
    Result<
      {
        cover: Asset;
        allImages: Asset[];
      },
      UseCaseErrors.DomainValidation
    >
  > {
    const coverUploaded = await this.uploaderService.uploadFile(coverFile, 'products');
    const imagesUploaded = await Promise.all(
      imageFiles.map(async (image) => ({
        ...(await this.uploaderService.uploadFile(image, 'products')),
        originalname: image.originalname,
      })),
    );

    const coverOrError = Asset.create(coverUploaded);
    const allImagesOrError = Result.combine(
      imagesUploaded.map((imageUploaded) => Asset.create(imageUploaded)),
    );

    const combinedResult = Result.combine([coverOrError, allImagesOrError]);
    if (combinedResult.isErr()) {
      return Result.fail(new UseCaseErrors.DomainValidation(combinedResult.error.message));
    }

    const [cover, allImages] = combinedResult.value;
    return Result.ok({ cover, allImages });
  }

  createProps = (
    request: CreateProductRequestDto,
  ): Result<
    Omit<ProductCreateProps, 'cover' | 'allImages' | 'images'>,
    UseCaseErrors.DomainValidation
  > => {
    const priceOrError = ProductPrice.create(request.price);
    const markdownOrError = ProductMarkdown.create(request.markdown);
    const minimumRequirementsOrError = ProductRequirements.create(request.minimumRequirements);
    const recommendedRequirementsOrError = ProductRequirements.create(
      request.recommendedRequirements,
    );
    const titleOrError = ProductTitle.create(request.title);
    const metaOrError = Meta.create({
      title: request.meta.title,
      description: request.meta.description,
      keywords: request.meta.keywords,
    });
    const propsResult = Result.combine([
      titleOrError,
      priceOrError,
      markdownOrError,
      minimumRequirementsOrError,
      recommendedRequirementsOrError,
      metaOrError,
    ]);

    if (propsResult.isErr()) {
      return Result.fail(new UseCaseErrors.DomainValidation(propsResult.error.message));
    }

    const [title, price, markdown, minimumRequirements, recommendedRequirements, meta] =
      propsResult.value;

    let link: ProductLink | null = null;

    if (request.link) {
      const linkOrError = ProductLink.create(request.link);
      if (linkOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(linkOrError.error.message));
      }
      link = linkOrError.value;
    }

    const props = {
      ...request,
      meta,
      link,
      price,
      markdown,
      minimumRequirements,
      recommendedRequirements,
      title,
    };
    return Result.ok(props);
  };

  execute = async (request: CreateProductRequestDto): Promise<Response> => {
    const { coverFile, allImageFiles } = request;
    const slug = request.slug || textUtils.generateSlug(request.title);

    try {
      const existingProduct = await this.checkForExistingProduct(slug, request.title);
      if (existingProduct.isErr()) {
        return Result.fail(existingProduct.error);
      }

      const guardResult = await this.applyGuard(request);
      if (guardResult.isErr()) {
        return Result.fail(guardResult.error);
      }

      const propsResult = this.createProps(request);
      if (propsResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(propsResult.error.message));
      }

      const partialProps = propsResult.value;
      const uploadResult = await this.uploadAssets(coverFile, allImageFiles);
      if (uploadResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(uploadResult.error.message));
      }

      const { cover, allImages } = uploadResult.value;
      const props: ProductCreateProps = {
        ...partialProps,
        cover,
        allImages,
        images: allImages.filter((image) => request.images.includes(image.originalFilename)),
      };

      const productOrError = Product.create(props);
      if (productOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(productOrError.error.message));
      }

      const product = productOrError.value;
      await this.productCommandsRepo.save(product);

      return Result.ok(product._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
