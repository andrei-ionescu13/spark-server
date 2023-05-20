import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateReviewStatusRequestDto } from './updateReviewStatusRequestDto';
import { UpdateReviewStatusUseCase } from './updateReviewStatusUseCase';

export class UpdateReviewStatusController extends BaseController {
  constructor(private useCase: UpdateReviewStatusUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: UpdateReviewStatusRequestDto = {
      reviewId: req.params.reviewId,
      status: req.body.status,
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

      const status = result.value.getValue();

      return this.ok(res, status);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
