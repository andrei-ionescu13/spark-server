import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { DeleteReviewRequestDto } from './deleteReviewRequestDto';
import { DeleteReviewUseCase } from './deleteReviewUseCase';

export class DeleteReviewController extends Controller {
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

      const review = result.value;
      return this.ok(res, { review });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
