import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { CreateDiscountRequestDto } from './createDiscountRequestDto';
import { CreateDiscountErrors, CreateDiscountUseCase } from './createDiscountUseCase';

export class CreateDiscountController extends BaseController {
  constructor(private useCase: CreateDiscountUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: CreateDiscountRequestDto = {
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
          case CreateDiscountErrors.ProductHasDiscountError:
            return this.forbidden(res, error.getErrorValue().message);

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
