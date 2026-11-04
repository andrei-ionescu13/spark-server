import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controllers';
import { UpdateProductStatusRequestDto } from './updateProductStatusRequestDto';
import { UpdateProductStatusUseCase } from './updateProductStatusUseCase';
import { zodRequestValidationError } from '../../../../zodErrors';
import z from 'zod';

export class UpdateProductStatusController extends Controller {
  constructor(private useCase: UpdateProductStatusUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      productId: z.uuidv7(),
      status: z.enum(['draft', 'published', 'archived']),
    });

    const result = schema.safeParse({
      productId: req.params.productId,
      status: req.body.status,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: UpdateProductStatusRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.forbidden(res, error.message);

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
