import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeletePublisherRequestDto } from './deletePublisherRequestDto';
import { DeletePublisherUseCase } from './deletePublisherUseCase';
import { AppError } from '../../../AppError';

export class DeletePublisherController extends BaseController {
  constructor(private useCase: DeletePublisherUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeletePublisherRequestDto = {
      publisherId: req.params.publisherId,
    };

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

      return this.noContent(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
