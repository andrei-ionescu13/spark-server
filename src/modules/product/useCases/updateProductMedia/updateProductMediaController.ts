import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { UpdateProductMediaRequestDto } from './updateProductMediaRequestDto';
import { UpdateProductMediaUseCase } from './updateProductMediaUseCase';
import * as z from 'zod';
import { toArray } from '../../../../utils/toArray';

export class UpdateProductMediaController extends Controller {
  constructor(private useCase: UpdateProductMediaUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const input = {
      productId: req.params.productId,
      videos: body.videos,
      allImages: body.allImages,
      images: body.images,
      coverFile: req.files?.['coverFile']?.[0],
      allImageFiles: req.files?.['allImageFiles[]'],
    };

    const schema = z.object({
      coverFile: z
        .object({
          originalname: z.string(),
          mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']),
          size: z.number().max(5_000_000_000),
          buffer: z.instanceof(Buffer),
        })
        .optional(),
      allImageFiles: z
        .array(
          z.object({
            originalname: z.string(),
            mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']),
            size: z.number().max(5_000_000_000),
            buffer: z.instanceof(Buffer),
          }),
        )
        .optional(),
      productId: z.uuidv7(),
      videos: z.preprocess(toArray, z.array(z.string()).min(1)),
      images: z.preprocess(toArray, z.array(z.string()).min(1)),
      allImages: z.preprocess(toArray, z.array(z.string()).min(1)),
    });

    const result = schema.safeParse(input);

    if (result.error) {
      console.log(result.error);
      return this.forbidden(res, result.error.message);
    }

    const dto: UpdateProductMediaRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      return this.ok(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
