import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { ListTranslationsLanguagesRequestDto } from './listTranslationsLanguagesRequestDto';
import { ListTranslationsLanguagesUseCase } from './listTranslationsLanguagesUseCase';

export class ListTranslationsLanguagesController extends BaseController {
  constructor(private useCase: ListTranslationsLanguagesUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: ListTranslationsLanguagesRequestDto = {};

    try {
      const result = await this.useCase.execute();

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const translationsLanguages = result.value.getValue();

      return this.ok(res, translationsLanguages);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
