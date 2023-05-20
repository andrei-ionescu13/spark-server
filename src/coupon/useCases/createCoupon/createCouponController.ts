import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { CreateCouponRequestDto } from './createCouponRequestDto';
import { CreateCouponUseCase } from './createCouponUseCase';

export class CreateCouponController extends BaseController {
  constructor(private useCase: CreateCouponUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: CreateCouponRequestDto = {
      code: body.code,
      endDate: body.endDate,
      productSelection: body.productSelection,
      products: body.products,
      startDate: body.startDate,
      type: body.type,
      userSelection: body.userSelection,
      users: body.users,
      value: body.value,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
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
