import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { UpdateTranslationRequestDto } from './updateTranslationRequestDto';
import { UpdateTranslationUseCase } from './updateTranslationUseCase';

export class UpdateTranslationController extends Controller {
  constructor(private useCase: UpdateTranslationUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: UpdateTranslationRequestDto = {
      namespaceId: req.params.namespaceId,
      key: req.params.key,
      ...req.body,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.conflict(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const namespaceId = result.value;
      return this.ok(res, namespaceId);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
