import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controller';
import { zodRequestValidationError } from '../../../../zodErrors';
import { UpdateDiscountRequestDto } from './updateDiscountRequestDto';
import { UpdateDiscountErrors, UpdateDiscountUseCase } from './updateDiscountUseCase';

export class UpdateDiscountController extends Controller {
  constructor(private useCase: UpdateDiscountUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z
      .object({
        discountId: z.uuidv7(),
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

    const result = schema.safeParse({ ...req.body, discountId: req.params.discountId });

    if (result.error) {
      console.log(result.error);
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: UpdateDiscountRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UpdateDiscountErrors.ProductHasDiscountError:
            return this.conflict(res, error.message);

          case UpdateDiscountErrors.ProductPriceError:
            return this.forbidden(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.conflict(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const id = result.value;
      return this.ok(res, id);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
