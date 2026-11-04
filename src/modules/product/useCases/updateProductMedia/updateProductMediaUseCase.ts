import { UseCaseErrors } from '../../../../appErrors';
import { Asset } from '../../../../assets';
import { Result } from '../../../../results';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../useCase';
import { DomainValidationError } from '../../../blog/article/domain/status';
import { Product, UpdateProductMediaProps } from '../../domain/product';
import { ProductCommandsRepoI } from '../../repo/commands';
import { UpdateProductMediaRequestDto } from './updateProductMediaRequestDto';

type Response = Result<void, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateProductMediaUseCase implements UseCase<UpdateProductMediaRequestDto, Response> {
  constructor(
    private productCommandsRepo: ProductCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  async uploadCover(
    product: Product,
    coverFile: UpdateProductMediaRequestDto['coverFile'],
  ): Promise<Result<Asset, DomainValidationError>> {
    await this.uploaderService.delete(product.cover.publicId);
    const uploadedCover = await this.uploaderService.uploadFile(coverFile, 'products');
    return Asset.create(uploadedCover);
  }

  execute = async (request: UpdateProductMediaRequestDto): Promise<Response> => {
    try {
      const product = await this.productCommandsRepo.getProduct(request.productId);
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      const imagesToDeletePublicIds = product.allImages
        .filter((image) => !request.allImages.includes(image.publicId))
        .map((image) => image.publicId);

      if (imagesToDeletePublicIds.length) {
        await this.uploaderService.deleteMultiple(imagesToDeletePublicIds);
      }

      let allImages = [
        ...product.allImages.filter((image) => !imagesToDeletePublicIds.includes(image.publicId)),
      ];

      if (request.allImageFiles?.length) {
        const uploadedNewImages = await this.uploaderService.uploadFiles(
          request.allImageFiles,
          'products',
        );
        const newImagesOrError = Result.combine(
          uploadedNewImages.map((image) => Asset.create(image)),
        );
        if (newImagesOrError.isErr()) {
          return Result.fail(new UseCaseErrors.DomainValidation(newImagesOrError.error.message));
        }

        const newImages = newImagesOrError.value;
        allImages = [...allImages, ...newImages];
      }

      const props: UpdateProductMediaProps = {
        allImages,
        images: allImages.filter(
          (image) =>
            request.images.includes(image.publicId) ||
            request.images.includes(image.originalFilename),
        ),
        videos: request.videos,
      };

      if (request.coverFile) {
        const coverOrError = await this.uploadCover(product, request.coverFile);
        if (coverOrError.isErr()) {
          return Result.fail(new UseCaseErrors.DomainValidation(coverOrError.error.message));
        }

        const cover = coverOrError.value;
        props.cover = cover;
      }

      product.updateMedia(props);
      await this.productCommandsRepo.save(product);
      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
