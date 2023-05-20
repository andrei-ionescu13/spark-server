import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteTranslationRequestDto } from './deleteTranslationRequestDto';
import { DeleteTranslationUseCase } from './deleteTranslationUseCase';
import { AppError } from '../../../AppError';

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

      return this.ok(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
