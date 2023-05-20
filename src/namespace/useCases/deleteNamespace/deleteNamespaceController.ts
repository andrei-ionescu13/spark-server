import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteNamespaceRequestDto } from './deleteNamespaceRequestDto';
import { DeleteNamespaceUseCase } from './deleteNamespaceUseCase';
import { AppError } from '../../../AppError';

export class DeleteNamespaceController extends BaseController {
  constructor(private useCase: DeleteNamespaceUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteNamespaceRequestDto = {
      namespaceId: req.params.namespaceId,
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

      return this.ok(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
