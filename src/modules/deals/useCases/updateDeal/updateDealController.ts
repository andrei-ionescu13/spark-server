import { Request, Response } from 'express';
import { UpdateDealRequestDto } from './updateDealRequestDto';
import { UpdateDealUseCase } from './updateDealUseCase';
import { Controller } from '../../../../controller';
import { UseCaseErrors } from '../../../../appErrors';
import { zodRequestValidationError } from '../../../../zodErrors';
import * as z from 'zod';

export class UpdateDealController extends Controller {
  constructor(private useCase: UpdateDealUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const input = {
      dealId: req.params.dealId,
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

    const schema = z
      .object({
        dealId: z.uuidv7(),
        title: z.string().min(1),
        coverFile: z
          .object({
            originalname: z.string(),
            mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']),
            size: z.number().max(5_000_000_000),
            buffer: z.instanceof(Buffer),
          })
          .optional(),
        description: z.string().min(8),
        products: z.array(z.uuidv7()).min(1),
        slug: z.string().min(1),
        startDate: z.coerce.date(),
        endDate: z.preprocess(
          (value) => (value === 'null' || value === '' ? null : value),
          z.coerce.date().nullable(),
        ),
        meta: z.object({
          title: z.string().min(8).max(120),
          description: z.string().min(8).max(1024),
          keywords: z.array(z.string()).min(1),
        }),
      })
      .superRefine(({ endDate, startDate }, ctx) => {
        if (endDate && startDate > endDate) {
          ctx.addIssue({
            code: 'custom',
            message: 'Start date must be before end date',
            path: ['startDate'],
          });
        }
      });

    const result = schema.safeParse(input);

    if (result.error) {
      console.log(result.error);
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: UpdateDealRequestDto = result.data;

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

      const value = result.value;
      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
