import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controller';
import { ImportKeysErrors, ImportKeysUseCase } from './importKeysUseCase';
import { zodRequestValidationError } from '../../../../zodErrors';
import * as z from 'zod';

const schema = z.object({
  keysFile: z.object({
    originalname: z.string(),
    mimetype: z.enum(['application/json']),
    size: z.number().max(5_000_000_000),
    buffer: z.instanceof(Buffer),
  }),
});

export type ImportKeysRequestDto = z.infer<typeof schema>;

export class ImportKeysController extends Controller {
  constructor(private useCase: ImportKeysUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({ keysFile: req.file });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto = result.data;
    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case ImportKeysErrors.KeyForPlatformExists:
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
