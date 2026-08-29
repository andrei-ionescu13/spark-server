import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { CreateNamespaceRequestDto } from './createNamespaceRequestDto';
import { CreateNamespaceErrors, CreateNamespaceUseCase } from './createNamespaceUseCase';

export class CreateNamespaceController extends Controller {
  constructor(private useCase: CreateNamespaceUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: CreateNamespaceRequestDto = {
      name: req.body.name,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case CreateNamespaceErrors.NameNotAvailable:
            return this.forbidden(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.unprocessable(res, error.message);

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
