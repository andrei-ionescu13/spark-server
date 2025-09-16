import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { GetNamespaceRequestDto } from './getNamespaceRequestDto';
import { GetNamespaceUseCase } from './getNamespaceUseCase';

export class GetNamespaceController extends Controller {
  constructor(private useCase: GetNamespaceUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetNamespaceRequestDto = {
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

      const namespace = result.value;
      return this.ok(res, namespace);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
