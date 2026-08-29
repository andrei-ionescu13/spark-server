import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { zodRequestValidationError } from '../../../../../zodErrors';
import { CreatePublisherRequestDto } from './createPublisherRequestDto';
import { CreatePublisherUseCase } from './createPublisherUseCase';

export class CreatePublisherController extends Controller {
  constructor(private useCase: CreatePublisherUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string().min(3),
      logoFile: z.object({
        originalname: z.string(),
        mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']),
        size: z.number().max(5_000_000),
        buffer: z.instanceof(Buffer),
      }),
    });

    const result = schema.safeParse({
      name: req.body.name,
      slug: req.body.slug,
      logoFile: req.file,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: CreatePublisherRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.DomainValidation:
            return this.unprocessable(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const publisher = result.value;
      return this.ok(res, { publisher });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
