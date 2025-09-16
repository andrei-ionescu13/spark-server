import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../src/AppError';
import { Controller } from '../../../src/Controller';
import { UpdateDiscountRequestDto } from './updateDiscountRequestDto';
import { UpdateDiscountErrors, UpdateDiscountUseCase } from './updateDiscountUseCase';

export class UpdateDiscountController extends Controller {
  constructor(private useCase: UpdateDiscountUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: UpdateDiscountRequestDto = {
      discountId: req.params.discountId,
      endDate: body.endDate,
      products: body.products,
      startDate: body.startDate,
      title: body.title,
      type: body.type,
      value: Number.parseFloat(body.value),
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case UpdateDiscountErrors.ProductHasDiscountError:
            return this.forbidden(res, error.getErrorValue().message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const value = result.value.getValue();

      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
