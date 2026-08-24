import { Request, Response } from 'express';
import { DeleteDealRequestDto } from './deleteDealRequestDto';
import { DeleteDealUseCase } from './deleteDealUseCase';
import { Controller } from '../../../Controller';
import { UseCaseErrors } from '../../../AppError';

export class DeleteDealController extends Controller {
  constructor(private useCase: DeleteDealUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteDealRequestDto = {
      dealId: req.params.dealId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

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
