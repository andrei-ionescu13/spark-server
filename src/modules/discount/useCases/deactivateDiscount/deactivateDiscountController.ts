import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controller';
import { DeactivateDiscountUseCase } from './deactivateDiscountUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  discountId: z.uuidv7(),
});

export type DeactivateDiscountRequestDto = z.infer<typeof schema>;

export class DeactivateDiscountController extends Controller {
  constructor(private useCase: DeactivateDiscountUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      discountId: req.params.discountId,
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

          case UseCaseErrors.DomainValidation:
            return this.conflict(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const discount = result.value;
      return this.ok(res, discount);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
