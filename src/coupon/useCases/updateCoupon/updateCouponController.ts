import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { zodRequestValidationError } from '../../../zodErrors';
import { UpdateCouponRequestDto } from './updateCouponRequestDto';
import { UpdateCouponUseCase } from './updateCouponUseCase';
export class UpdateCouponController extends Controller {
  constructor(private useCase: UpdateCouponUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const input = {
      couponId: req.params.couponId,
      code: body.code,
      endDate: body.endDate,
      products: body.products,
      startDate: body.startDate,
      type: body.type,
      users: body.users,
      value: body.value,
    };

    const schema = z.object({
      couponId: z.string(),
      code: z.string().min(3),
      endDate: z.coerce
        .date()
        .refine((date) => date > new Date(), { message: 'End date must be in the future' }),
      products: z.array(z.string()),
      startDate: z.coerce.date(),
      type: z.enum(['amount', 'percentage']),
      users: z.array(z.string()),
      value: z.coerce.number().positive(),
    });

    const result = schema.safeParse(input);

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: UpdateCouponRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.unprocessable(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const coupon = result.value;
      return this.ok(res, coupon);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
