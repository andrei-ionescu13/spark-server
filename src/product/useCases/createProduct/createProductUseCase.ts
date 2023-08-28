import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { KeyRepoI } from '../../../key/keyRepo';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { ProductRepoI } from '../../productRepo';
import { CreateProductRequestDto } from './createProductRequestDto';
import { textUtils } from '../../../utils/textUtils';
import { UseCaseError } from '../../../UseCaseError';

export namespace CreateProductErrors {
  export class KeyForPlatformExists extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'One or more keys could not be added' });
    }
  }
  export class TitleNotAvailableError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Title not available' });
    }
  }

  export class SlugNotAvailableError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Slug not available' });
    }
  }
}

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class CreateProductUseCase implements UseCase<CreateProductRequestDto, Response> {
  constructor(
    private productRepo: ProductRepoI,
    private keyRepo: KeyRepoI,
    private uploaderService: UploaderService,
  ) {}

  comparePropsToProduct = (props, article): Result<UseCaseError> => {
    if (props.title === article.title) {
      return new CreateProductErrors.TitleNotAvailableError();
    }

    if (props.slug === article.slug) {
      return new CreateProductErrors.SlugNotAvailableError();
    }

    return new AppError.UnexpectedError();
  };

  createKey = async (
    productId,
    value,
  ): Promise<AppError.NotFound | CreateProductErrors.KeyForPlatformExists | Result<string>> => {
    const product = await this.productRepo.getProduct(productId);
    const productFound = !!product;

    if (!productFound) {
      return new AppError.NotFound('Product not found');
    }

    let key = await this.keyRepo.getKeyByValue(value);
    const keyFound = !!key;

    if (keyFound) {
      const productsByKeyFound = await this.productRepo.searchProductsByKeys(value);
      let samePlatform;

      if (productsByKeyFound.length) {
        for (const productByKeyFound of productsByKeyFound) {
          if (
            productByKeyFound.platform._id.toString() === productByKeyFound.platform._id.toString()
          ) {
            samePlatform = productByKeyFound.platform;
            break;
          }
        }
      }

      const isSamePlatform = !!samePlatform;

      if (isSamePlatform) {
        return new CreateProductErrors.KeyForPlatformExists();
      }
    }

    key = await this.keyRepo.createKey({
      product: productId,
      value,
    });

    await this.productRepo.addProductKey(productId, key);

    return Result.ok<string>(key._id);
  };

  execute = async (request: CreateProductRequestDto): Promise<Response> => {
    const { shouldPublish, coverFile, imageFiles, keysFile, ...rest } = request;
    const props: any = rest;
    props.status = shouldPublish ? 'published' : 'draft';
    props.slug ??= textUtils.generateSlug(props.title);

    try {
      const existingProduct = await this.productRepo.getProductByProps([
        { slug: props.slug },
        { title: props.title },
      ]);
      const productExists = !!existingProduct;

      if (productExists) {
        return left(this.comparePropsToProduct(props, existingProduct));
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

      const product = await this.productRepo.createProduct(props);

      const keys = keysFile.buffer
        .toString()
        .split('\n')
        .map((key) => key.trim());

      const results = await Promise.all(keys.map((key) => this.createKey(product._id, key)));
      const combinedResult = Result.combine(results);

      return combinedResult.isFailure ? left(combinedResult) : right(Result.ok<any>(product._id));
      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
