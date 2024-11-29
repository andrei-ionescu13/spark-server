import { Request, Response } from 'express';
import { AppError } from '../../../AppError';
import { BaseController } from '../../../BaseController';
import { DeleteTranslationRequestDto } from './deleteTranslationRequestDto';
import { DeleteTranslationUseCase } from './deleteTranslationUseCase';

export class DeleteTranslationController extends BaseController {
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

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

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
