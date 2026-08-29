import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../useCase';
import { UseCaseError } from '../../../../UseCaseError';
import { Asset } from '../../../blog/article/asset';
import { ProductCommandsRepoI } from '../../repo/commands';
import { UpdateProductMediaRequestDto } from './updateProductMediaRequestDto';

type Response = Result<void, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateProductMediaUseCase implements UseCase<UpdateProductMediaRequestDto, Response> {
  constructor(
    private productCommandsRepo: ProductCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: UpdateProductMediaRequestDto): Promise<Response> => {
    const { productId, coverFile, imageFiles, ...rest } = request;
    const props: any = rest;

    try {
      const productOrError = await this.productCommandsRepo.getProduct(productId);
      if (productOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(productOrError.error.message));

      const product = productOrError.value;
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      if (coverFile) {
        await this.uploaderService.delete(product.cover.publicId);
        const uploadedCover = await this.uploaderService.uploadFile(coverFile, 'products');
        props.cover = uploadedCover;
      }

      const filesToDelete = product.images.filter(
        (productImage) => !props.images.includes(productImage.publicId),
      );

      await Promise.all(filesToDelete.map((file) => this.uploaderService.delete(file.publicId)));
      props.images = product.images.filter((productImage) =>
        props.images.includes(productImage.publicId),
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

      const coverOrError = Asset.create(props.cover);
      const imagesOrError = Result.combine(props.images.map((image) => Asset.create(image)));
      const selectedImagesOrError = Result.combine(
        props.selectedImages.map((image) => Asset.create(image)),
      );
      const combinedResult = Result.combine([coverOrError, imagesOrError, selectedImagesOrError]);
      if (combinedResult.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(combinedResult.error.message));

      const cover = coverOrError.value;
      const images = imagesOrError.value;
      const selectedImages = selectedImagesOrError.value;

      product.updateMedia({
        cover,
        images,
        selectedImages,
        videos: props.videos,
      });

      await this.productCommandsRepo.save(product);
      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
