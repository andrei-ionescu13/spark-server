import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteTranslationsLanguageRequestDto } from './deleteTranslationsLanguageRequestDto';
import { DeleteTranslationsLanguageUseCase } from './deleteTranslationsLanguageUseCase';
import { AppError } from '../../../AppError';

export class DeleteTranslationsLanguageController extends BaseController {
  constructor(private useCase: DeleteTranslationsLanguageUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteTranslationsLanguageRequestDto = {
      translationsLanguageId: req.params.translationsLanguageId,
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

      return this.noContent(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
