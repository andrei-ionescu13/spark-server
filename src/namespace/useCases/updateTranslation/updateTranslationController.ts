import { Request, Response } from 'express';
import { AppError } from '../../../AppError';
import { BaseController } from '../../../BaseController';
import { UpdateTranslationRequestDto } from './updateTranslationRequestDto';
import { UpdateTranslationUseCase } from './updateTranslationUseCase';

export class UpdateTranslationController extends BaseController {
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

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const value = result.value.getValue();

      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
