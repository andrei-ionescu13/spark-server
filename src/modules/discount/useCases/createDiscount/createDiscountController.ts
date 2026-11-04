import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../appErrors';
import { Controller } from '../../../../controller';
import { zodRequestValidationError } from '../../../../zodErrors';
import { CreateDiscountRequestDto } from './createDiscountRequestDto';
import { CreateDiscountErrors, CreateDiscountUseCase } from './createDiscountUseCase';

export class CreateDiscountController extends Controller {
  constructor(private useCase: CreateDiscountUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z
      .object({
        endDate: z.coerce.date().nullable(),
        product: z.uuidv7(),
        startDate: z.coerce.date(),
        title: z.string().min(1),
        type: z.enum(['amount', 'percentage']),
        value: z.number().min(1),
      })
      .superRefine((data, ctx) => {
        if (data.endDate && data.startDate >= data.endDate) {
          ctx.addIssue({
            code: 'custom',
            message: 'Start date must be before end date',
            path: ['startDate'],
          });
        }
      });

    const result = schema.safeParse(req.body);

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: CreateDiscountRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case CreateDiscountErrors.ProductHasDiscountError:
            return this.forbidden(res, error.message);

          case CreateDiscountErrors.ProductPriceError:
            return this.forbidden(res, error.message);

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
