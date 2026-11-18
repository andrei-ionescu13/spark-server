import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { GetPublisherUseCase } from './getPublisherUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../../zodErrors';

const schema = z.object({
  publisherId: z.uuidv7(),
});

export type GetPublisherRequestDto = z.infer<typeof schema>;

export class GetPublisherController extends Controller {
  constructor(private useCase: GetPublisherUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      publisherId: req.params.publisherId,
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

          default:
            return this.fail(res, error);
        }
      }

      const publisher = result.value;
      return this.ok(res, publisher);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
