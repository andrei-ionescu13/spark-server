import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { zodRequestValidationError } from '../../../../../zodErrors';
import { UpdatePlatformRequestDto } from './updatePlatformRequestDto';
import { UpdatePlatformUseCase } from './updatePlatformUseCase';

export class UpdatePlatformController extends Controller {
  constructor(private useCase: UpdatePlatformUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string().min(3),
      platformId: z.string(),
      url: z.string().url(),
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
      platformId: req.params.platformId,
      logoFile: req.file,
      url: req.body.url,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: UpdatePlatformRequestDto = result.data;

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

      const platform = result.value;
      return this.ok(res, { platform });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
