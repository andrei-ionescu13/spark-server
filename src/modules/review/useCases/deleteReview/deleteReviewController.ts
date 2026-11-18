import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controller';
import * as z from 'zod';
import { DeleteReviewUseCase } from './deleteReviewUseCase';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  reviewId: z.uuidv7(),
});

export type DeleteReviewRequestDto = z.infer<typeof schema>;

export class DeleteReviewController extends Controller {
  constructor(private useCase: DeleteReviewUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      reviewId: req.params.reviewId,
    });

    if (result.error) {
      console.log(result.error);
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto = result.data;

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
