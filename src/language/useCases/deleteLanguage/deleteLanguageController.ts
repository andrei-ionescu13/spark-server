import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteLanguageRequestDto } from './deleteLanguageRequestDto';
import { DeleteLanguageUseCase } from './deleteLanguageUseCase';
import { AppError } from '../../../AppError';

export class DeleteLanguageController extends BaseController {
  constructor(private useCase: DeleteLanguageUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteLanguageRequestDto = { languageId: req.params.languageId };

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
