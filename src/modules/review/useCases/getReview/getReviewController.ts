import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { GetReviewRequestDto } from './getReviewRequestDto';
import { GetReviewUseCase } from './getReviewUseCase';

export class GetReviewController extends Controller {
  constructor(private useCase: GetReviewUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetReviewRequestDto = { reviewId: req.params.reviewId };

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

      const review = result.value;
      return this.ok(res, review);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
