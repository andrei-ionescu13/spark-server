import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteReviewRequestDto } from './deleteReviewRequestDto';
import { DeleteReviewUseCase } from './deleteReviewUseCase';

export class DeleteReviewController extends BaseController {
  constructor(private useCase: DeleteReviewUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteReviewRequestDto = {
      reviewId: req.params.reviewId,
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

      const review = result.value.getValue();

      return this.ok(res, { review });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
