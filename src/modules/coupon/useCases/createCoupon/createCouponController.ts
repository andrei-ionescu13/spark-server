import { Request, Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../../Controller';
import { zodRequestValidationError } from '../../../../zodErrors';
import { CreateCouponRequestDto } from './createCouponRequestDto';
import { CreateCouponUseCase } from './createCouponUseCase';

export class CreateCouponController extends Controller {
  constructor(private useCase: CreateCouponUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      code: z.string().min(3),
      endDate: z.coerce
        .date()
        .refine((date) => date > new Date(), { message: 'End date must be in the future' }),
      productSelection: z.enum(['general', 'selected']),
      products: z.array(z.string()),
      startDate: z.coerce.date(),
      type: z.enum(['amount', 'percentage']),
      userSelection: z.enum(['general', 'selected']),
      users: z.array(z.string()),
      value: z.coerce.number().positive(),
    });
    const result = schema.safeParse(req.body);

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: CreateCouponRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
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
