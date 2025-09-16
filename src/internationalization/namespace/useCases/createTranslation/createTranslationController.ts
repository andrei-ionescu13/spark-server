import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { CreateTranslationRequestDto } from './createTranslationRequestDto';
import { CreateTranslationErrors, CreateTranslationUseCase } from './createTranslationUseCase';

export class CreateTranslationController extends Controller {
  constructor(private useCase: CreateTranslationUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: CreateTranslationRequestDto = {
      namespaceId: req.params.namespaceId,
      key: req.body.key,
      ...req.body,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case CreateTranslationErrors.KeyIsUserError:
            return this.conflict(res, error.message);

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
