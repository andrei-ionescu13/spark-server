import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { zodRequestValidationError } from '../../../../zodErrors';
import { CreateLanguageRequestDto } from './createLanguageRequestDto';
import { CreateLanguageUseCase } from './createLanguageUseCase';

export class CreateLanguageController extends Controller {
  constructor(private useCase: CreateLanguageUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string(),
      code: z.string().min(2).max(2),
      nativeName: z.string(),
    });

    const result = schema.safeParse({
      name: req.body.name,
      slug: req.body.slug,
      logoFile: req.file,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: CreateLanguageRequestDto = result.data;

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
