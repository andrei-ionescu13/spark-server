import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { zodRequestValidationError } from '../../../../../zodErrors';
import { CreateDeveloperUseCase } from './createDeveloperUseCase';

const schema = z.object({
  name: z.string().min(3),
  logoFile: z.object({
    originalname: z.string(),
    mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']),
    size: z.number().max(5_000_000_000),
    buffer: z.instanceof(Buffer),
  }),
});

export type CreateDeveloperRequestDto = z.infer<typeof schema>;

export class CreateDeveloperController extends Controller {
  constructor(private useCase: CreateDeveloperUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      name: req.body.name,
      slug: req.body.slug,
      logoFile: req.file,
    });

    if (result.error) {
      console.log(req.file);
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto = result.data;

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

      const developer = result.value;
      return this.ok(res, { developer });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
