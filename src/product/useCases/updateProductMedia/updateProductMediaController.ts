import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateProductMediaRequestDto } from './updateProductMediaRequestDto';
import { UpdateProductMediaUseCase } from './updateProductMediaUseCase';
import { AppError } from '../../../AppError';

export class UpdateProductMediaController extends BaseController {
  constructor(private useCase: UpdateProductMediaUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: UpdateProductMediaRequestDto = {
      productId: req.params.productId,
      videos: body.videos,
      images: body.images || [],
      selectedImages: body.selectedImages || [],
      coverFile: req.files?.['cover']?.[0],
      imageFiles: req.files?.['images[]'],
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const product = result.value.getValue();

      return this.ok(res, product);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
