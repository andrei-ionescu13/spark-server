import { Request, Response } from 'express';
import { GetAdminUseCase } from './getAdminUseCase';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controller';
import { DecodedRequest } from '../../../../decodedRequest';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({ user: z.string() });

export type GetAdminRequestDto = z.infer<typeof schema>;

export class GetAdminController extends Controller {
  constructor(private useCase: GetAdminUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: DecodedRequest, res: Response) => {
    const validation = schema.safeParse({
      user: req.user,
    });

    if (validation.error) {
      return this.forbidden(res, zodRequestValidationError(validation.error).message);
    }

    const dto = validation.data;

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
      const user = result.value;
      return this.ok(res, user);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
