import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { KeyRepoI } from '../../../key/keyRepo';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { ProductRepoI } from '../../productRepo';
import { CreateProductRequestDto } from './createProductRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class CreateProductUseCase implements UseCase<CreateProductRequestDto, Response> {
  constructor(
    private productRepo: ProductRepoI,
    private keyRepo: KeyRepoI,
    private uploaderService: UploaderService,
  ) {}

  createKey = async (productId, value) => {
    try {
      const product = await this.productRepo.getProduct(productId);

      if (!product) {
        return left(new AppError.NotFound('Product not found'));
      }

      const key = await this.keyRepo.createKey({
        product: productId,
        value,
      });

      await this.productRepo.addProductKey(productId, key);

      return right(Result.ok<any>(key._id));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };

  execute = async (request: CreateProductRequestDto): Promise<Response> => {
    const { shouldPublish, coverFile, imageFiles, keysFile, ...rest } = request;
    const props: any = rest;
    props.status = shouldPublish ? 'published' : 'draft';

    try {
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
      await Promise.all(keys.map((key) => this.createKey(product._id, key)));

      return right(Result.ok<any>(product._id));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
