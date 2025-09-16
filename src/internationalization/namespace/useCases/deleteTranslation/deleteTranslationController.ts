import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { DeleteTranslationRequestDto } from './deleteTranslationRequestDto';
import { DeleteTranslationUseCase } from './deleteTranslationUseCase';

export class DeleteTranslationController extends Controller {
  constructor(private useCase: DeleteTranslationUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteTranslationRequestDto = {
      namespaceId: req.params.namespaceId,
      key: req.params.key,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const key = result.value;

      return this.ok(res, key);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
