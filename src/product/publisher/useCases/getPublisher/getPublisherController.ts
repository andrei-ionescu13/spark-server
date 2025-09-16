import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { GetPublisherRequestDto } from './getPublisherRequestDto';
import { GetPublisherUseCase } from './getPublisherUseCase';

export class GetPublisherController extends Controller {
  constructor(private useCase: GetPublisherUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetPublisherRequestDto = { publisherId: req.params.publisherId };

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
