import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { zodRequestValidationError } from '../../../zodErrors';
import { UpdateCollectionRequestDto } from './updateCollectionRequestDto';
import { UpdateCollectionUseCase } from './updateCollectionUseCase';

export class UpdateCollectionController extends Controller {
  constructor(private useCase: UpdateCollectionUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const input = {
      collectionId: req.params.collectionId,
      coverFile: req.file as Express.Multer.File,
      description: body.description,
      isDeal: JSON.parse(body.isDeal),
      products: body.products,
      slug: body.slug,
      startDate: body.startDate,
      title: body.title,
      endDate: body.endDate,
      meta: {
        description: body.meta.description,
        keywords: body.meta.keywords,
        title: body.meta.title,
      },
    };

    const schema = z.object({
      collectionId: z.uuidv7(),
      title: z.string().min(1),
      coverFile: z
        .object({
          originalname: z.string(),
          mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']),
          size: z.number().max(5_000_000),
          buffer: z.instanceof(Buffer),
        })
        .optional(),
      description: z.string().min(8),
      isDeal: z.coerce.boolean(),
      products: z.array(z.uuidv7()).min(1),
      slug: z.string().min(1),
      startDate: z.date(),
      endDate: z.coerce.date().optional(),
      meta: z.object({
        title: z.string().min(8).max(120),
        description: z.string().min(120).max(1024),
        keywords: z.array(z.string()).min(3),
      }),
    });

    const result = schema.safeParse(input);

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: UpdateCollectionRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const collection = result.value;
      return this.ok(res, collection);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
