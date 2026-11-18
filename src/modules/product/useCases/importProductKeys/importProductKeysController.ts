import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controller';
import { ImportProductKeysErrors, ImportProductKeysUseCase } from './importProductKeysUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  productId: z.string().min(3),
  file: z.object({
    originalname: z.string(),
    mimetype: z.enum(['text/plain']),
    size: z.number().max(5_000_000_000),
    buffer: z.instanceof(Buffer),
  }),
});

export type ImportProductKeysRequestDto = z.infer<typeof schema>;

export class ImportProductKeysController extends Controller {
  constructor(private useCase: ImportProductKeysUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      file: req.file as Express.Multer.File,
      productId: req.params.productId,
    });

    if (result.error) {
      console.log(result.error);
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case ImportProductKeysErrors.KeyForPlatformExists:
            return this.forbidden(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.forbidden(res, error.message);

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
