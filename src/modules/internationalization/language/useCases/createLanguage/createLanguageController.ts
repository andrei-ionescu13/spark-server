import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { zodRequestValidationError } from '../../../../../zodErrors';
import { CreateLanguageUseCase } from './createLanguageUseCase';

const schema = z.object({
  name: z.string(),
  code: z.string().min(2).max(2),
});

export type CreateLanguageRequestDto = z.infer<typeof schema>;

export class CreateLanguageController extends Controller {
  constructor(private useCase: CreateLanguageUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      name: req.body.name,
      code: req.body.code,
    });

    if (result.error) {
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

      const language = result.value;
      return this.ok(res, { language });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
