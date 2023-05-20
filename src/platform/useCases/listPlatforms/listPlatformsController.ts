import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { ListPlatformsRequestDto } from './listPlatformsRequestDto';
import { ListPlatformsUseCase } from './listPlatformsUseCase';

export class ListPlatformsController extends BaseController {
  constructor(private useCase: ListPlatformsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    try {
      const result = await this.useCase.execute();

      if (result.isLeft()) {
        const error = result.value.getErrorValue();

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const platforms = result.value.getValue();

      return this.ok(res, platforms);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
