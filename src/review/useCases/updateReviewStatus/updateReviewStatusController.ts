import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { zodRequestValidationError } from '../../../zodErrors';
import { UpdateReviewStatusRequestDto } from './updateReviewStatusRequestDto';
import { UpdateReviewStatusUseCase } from './updateReviewStatusUseCase';

export class UpdateReviewStatusController extends Controller {
  constructor(private useCase: UpdateReviewStatusUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      reviewId: z.string(),
      status: z.enum(['published', 'unpublished', 'flagged']),
    });

    const result = schema.safeParse({
      reviewId: req.params.reviewId,
      status: req.body.status,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: UpdateReviewStatusRequestDto = result.data;

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

      const status = result.value;
      return this.ok(res, status);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
