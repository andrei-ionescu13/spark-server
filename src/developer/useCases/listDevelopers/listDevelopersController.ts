import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { ListDevelopersRequestDto } from './listDevelopersRequestDto';
import { ListDevelopersUseCase } from './listDevelopersUseCase';

export class ListDevelopersController extends BaseController {
  constructor(private useCase: ListDevelopersUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    try {
      const result = await this.useCase.execute();

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const developers = result.value.getValue();

      return this.ok(res, developers);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
