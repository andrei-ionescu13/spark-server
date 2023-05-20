import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { ListLanguagesRequestDto } from './listLanguagesRequestDto';
import { ListLanguagesUseCase } from './listLanguagesUseCase';

export class ListLanguagesController extends BaseController {
  constructor(private useCase: ListLanguagesUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: ListLanguagesRequestDto = {};

    try {
      const result = await this.useCase.execute();

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const languages = result.value.getValue();

      return this.ok(res, languages);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
