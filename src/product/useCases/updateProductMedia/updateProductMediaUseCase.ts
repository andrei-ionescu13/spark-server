import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { ProductRepoI } from '../../productRepo';
import { UpdateProductMediaRequestDto } from './updateProductMediaRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class UpdateProductMediaUseCase implements UseCase<UpdateProductMediaRequestDto, Response> {
  constructor(private productRepo: ProductRepoI, private uploaderService: UploaderService) {}

  execute = async (request: UpdateProductMediaRequestDto): Promise<Response> => {
    const { productId, coverFile, imageFiles, ...rest } = request;
    const props: any = rest;

    try {
      const product = await this.productRepo.getProduct(productId);
      const found = !!product;

      if (!product) {
        return left(new AppError.NotFound('Product not found'));
      }

      if (coverFile) {
        await this.uploaderService.delete(product.cover.public_id);
        const uploadedCover = await this.uploaderService.uploadFile(coverFile, 'products');
        props.cover = uploadedCover;
      }

      const filesToDelete = product.images.filter(
        (productImage) => !props.images.includes(productImage.public_id),
      );
      await Promise.all(filesToDelete.map((file) => this.uploaderService.delete(file.public_id)));
      props.images = product.images.filter((productImage) =>
        props.images.includes(productImage.public_id),
      );

      if (imageFiles) {
        const imagesUploadRes = await Promise.all(
          imageFiles.map(async (image) => ({
            ...(await this.uploaderService.uploadFile(image, 'products')),
            originalname: image.originalname,
          })),
        );

        imagesUploadRes.forEach((x) => props.images.push(x));
      }
      props.selectedImages = props.images.filter(
        (image) =>
          props.selectedImages.includes(image.public_id) ||
          props.selectedImages.includes(image.originalname),
      );

      const updatedProduct = await this.productRepo.updateProduct(productId, props);

      return right(Result.ok<any>(updatedProduct));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
