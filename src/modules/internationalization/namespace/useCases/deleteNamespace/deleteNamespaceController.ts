import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { DeleteNamespaceRequestDto } from './deleteNamespaceRequestDto';
import { DeleteNamespaceUseCase } from './deleteNamespaceUseCase';

export class DeleteNamespaceController extends Controller {
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

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const namespaceName = result.value;
      return this.ok(res, namespaceName);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
