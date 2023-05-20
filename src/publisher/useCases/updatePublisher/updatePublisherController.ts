import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdatePublisherRequestDto } from './updatePublisherRequestDto';
import { UpdatePublisherUseCase } from './updatePublisherUseCase';
import { AppError } from '../../../AppError';

export class UpdatePublisherController extends BaseController {
  constructor(private useCase: UpdatePublisherUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: UpdatePublisherRequestDto = {
      name: req.body.name,
      publisherId: req.params.publisherId,
      logoFile: req.file,
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

      const publisher = result.value.getValue();

      return this.ok(res, { publisher });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
