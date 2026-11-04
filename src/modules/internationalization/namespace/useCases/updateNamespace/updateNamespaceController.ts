import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { UpdateNamespaceRequestDto } from './updateNamespaceRequestDto';
import { UpdateNamespaceUseCase } from './updateNamespaceUseCase';

export class UpdateNamespaceController extends Controller {
  constructor(private useCase: UpdateNamespaceUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: UpdateNamespaceRequestDto = {
      namespaceId: req.params.namespaceId,
      name: req.body.name,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.DomainValidation:
            return this.conflict(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const name = result.value;
      return this.ok(res, name);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
