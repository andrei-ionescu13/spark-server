import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { DeleteLanguageUseCase } from './deleteLanguageUseCase';
import { zodRequestValidationError } from '../../../../../zodErrors';
import * as z from 'zod';

const schema = z.object({
  languageId: z.uuidv7(),
});

export type DeleteLanguageRequestDto = z.infer<typeof schema>;

export class DeleteLanguageController extends Controller {
  constructor(private useCase: DeleteLanguageUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      languageId: req.params.languageId,
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
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      return this.noContent(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
