import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controller';
import { zodRequestValidationError } from '../../../../zodErrors';
import { CreateCollectionRequestDto } from './createCollectionRequestDto';
import { CreateCollectionUseCase } from './createCollectionUseCase';

export class CreateCollectionController extends Controller {
  constructor(private useCase: CreateCollectionUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const input = {
      coverFile: req.file as Express.Multer.File,
      description: body.description,
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
      title: z.string().min(1),
      coverFile: z.object({
        originalname: z.string(),
        mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']),
        size: z.number().max(5_000_000_000),
        buffer: z.instanceof(Buffer),
      }),
      description: z.string().min(1),
      products: z.array(z.uuidv7()).min(1),
      slug: z.string().min(1),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().nullable(),
      meta: z.object({
        title: z.string().min(1).max(120),
        description: z.string().min(1).max(1024),
        keywords: z.array(z.string()).min(1),
      }),
    });

    const result = schema.safeParse(input);

    if (result.error) {
      console.log(result.error);
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: CreateCollectionRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.DomainValidation:
            return this.clientError(res, error.message);

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
