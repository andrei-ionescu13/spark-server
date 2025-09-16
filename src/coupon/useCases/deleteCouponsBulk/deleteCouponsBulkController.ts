import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { DeleteCouponsBulkRequestDto } from './deleteCouponsBulkRequestDto';
import { DeleteCouponsBulkUseCase } from './deleteCouponsBulkUseCase';

export class DeleteCouponsBulkController extends Controller {
  constructor(private useCase: DeleteCouponsBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteCouponsBulkRequestDto = {
      ids: req.body.ids,
    };

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

      return this.noContent(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
