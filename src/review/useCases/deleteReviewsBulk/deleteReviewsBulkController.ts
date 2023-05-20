import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteReviewsBulkRequestDto } from './deleteReviewsBulkRequestDto';
import { DeleteReviewsBulkUseCase } from './deleteReviewsBulkUseCase';

export class DeleteReviewsBulkController extends BaseController {
  constructor(private useCase: DeleteReviewsBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteReviewsBulkRequestDto = {};

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }
      const result = result.value.getValue();
      return this.ok(res, result);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
