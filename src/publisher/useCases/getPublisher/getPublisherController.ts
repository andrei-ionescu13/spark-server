import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { GetPublisherRequestDto } from './getPublisherRequestDto';
import { GetPublisherUseCase } from './getPublisherUseCase';
import { AppError } from '../../../AppError';

export class GetPublisherController extends BaseController {
  constructor(private useCase: GetPublisherUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetPublisherRequestDto = { publisherId: req.params.publisherId };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const publisher = result.value.getValue();

      return this.ok(res, publisher);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
