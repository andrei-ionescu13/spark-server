import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { zodRequestValidationError } from '../../../../zodErrors';
import { UpdatePublisherRequestDto } from './updatePublisherRequestDto';
import { UpdatePublisherUseCase } from './updatePublisherUseCase';

export class UpdatePublisherController extends Controller {
  constructor(private useCase: UpdatePublisherUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string().min(3),
      publisherId: z.string(),
      logoFile: z
        .object({
          originalname: z.string(),
          mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']),
          size: z.number().max(5_000_000),
          buffer: z.instanceof(Buffer),
        })
        .optional(),
    });

    const result = schema.safeParse({
      name: req.body.name,
      publisherId: req.params.publisherId,
      logoFile: req.file,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: UpdatePublisherRequestDto = result.data;
    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

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
