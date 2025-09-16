import { Request, Response } from 'express';
import { Controller } from '../../../src/Controller';
import { DeleteDiscountsBulkRequestDto } from './deleteDiscountsBulkRequestDto';
import { DeleteDiscountsBulkUseCase } from './deleteDiscountsBulkUseCase';

export class DeleteDiscountsBulkController extends Controller {
  constructor(private useCase: DeleteDiscountsBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteDiscountsBulkRequestDto = {
      ids: req.body.ids,
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

      return this.noContent(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
