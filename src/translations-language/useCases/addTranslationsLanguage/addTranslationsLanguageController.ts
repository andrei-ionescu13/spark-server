import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { AddTranslationsLanguageRequestDto } from './addTranslationsLanguageRequestDto';
import {
  AddTranslationsLanguageErrors,
  AddTranslationsLanguageUseCase,
} from './addTranslationsLanguageUseCase';

export class AddTranslationsLanguageController extends BaseController {
  constructor(private useCase: AddTranslationsLanguageUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: AddTranslationsLanguageRequestDto = {
      name: body.name,
      code: body.code,
      nativeName: body.nativeName,
      _id: body._id,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AddTranslationsLanguageErrors.TranslationsLanguageExistsError:
            return this.forbidden(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const translationsLanguage = result.value.getValue();

      return this.ok(res, translationsLanguage);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
