import { Request, Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../../controllers';
import { zodRequestValidationError } from '../../../../zodErrors';
import { CreateCouponRequestDto } from './createCouponRequestDto';
import { CreateCouponUseCase } from './createCouponUseCase';

export class CreateCouponController extends Controller {
  constructor(private useCase: CreateCouponUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const schema = z
      .object({
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

    const input = {
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

    const result = schema.safeParse(input);

    if (result.error) {
      console.log(result.error);
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
