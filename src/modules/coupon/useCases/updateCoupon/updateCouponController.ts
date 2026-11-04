import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controller';
import { zodRequestValidationError } from '../../../../zodErrors';
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
      productSelection: body.productSelection,
      userSelection: body.userSelection,
    };

    const schema = z
      .object({
        couponId: z.uuidv7(),
        code: z.string().min(3),
        endDate: z.coerce
          .date()
          .refine((date) => date > new Date(), { message: 'End date must be in the future' })
          .nullable(),
        startDate: z.coerce.date(),
        type: z.enum(['amount', 'percentage']),
        value: z.coerce.number().positive(),
      })
      .superRefine(({ endDate, startDate }, ctx) => {
        if (endDate && startDate > endDate) {
          ctx.addIssue({
            code: 'custom',
            message: 'Start date must be before end date',
            path: ['startDate'],
          });
        }
      })
      .and(
        z.discriminatedUnion('productSelection', [
          z.object({
            productSelection: z.literal('selected'),
            products: z.array(z.string()).min(1),
          }),
          z.object({
            productSelection: z.literal('general'),
            products: z.null(),
          }),
        ]),
      )
      .and(
        z.discriminatedUnion('userSelection', [
          z.object({
            userSelection: z.literal('selected'),
            users: z.array(z.string()).min(1),
          }),
          z.object({
            userSelection: z.literal('general'),
            users: z.null(),
          }),
        ]),
      );

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
