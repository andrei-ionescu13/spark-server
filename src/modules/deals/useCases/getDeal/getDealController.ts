import { Request, Response } from 'express';
import { GetDealUseCase } from './getDealUseCase';
import { Controller } from '../../../../controller';
import { UseCaseErrors } from '../../../../appError';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  dealId: z.uuidv7(),
});

export type GetDealRequestDto = z.infer<typeof schema>;

export class GetDealController extends Controller {
  constructor(private useCase: GetDealUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      dealId: req.params.couponId,
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

      const value = result.value;
      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
