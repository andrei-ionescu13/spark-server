import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { AddLanguageRequestDto } from './addLanguageRequestDto';
import { AddLanguageErrors, AddLanguageUseCase } from './addLanguageUseCase';

export class AddLanguageController extends BaseController {
  constructor(private useCase: AddLanguageUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: AddLanguageRequestDto = {
      name: body.name,
      code: body.code,
      nativeName: body.nativeName,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AddLanguageErrors.LanguageExistsError:
            return this.forbidden(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const language = result.value.getValue();

      return this.ok(res, language);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
