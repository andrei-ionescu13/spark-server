import { Request, Response } from 'express';
import { Controller } from '../../../../Controller';
import { ListDevelopersRequestDto } from './listDevelopersRequestDto';
import { ListDevelopersUseCase } from './listDevelopersUseCase';

export class ListDevelopersController extends Controller {
  constructor(private useCase: ListDevelopersUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: ListDevelopersRequestDto = {};

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const developers = result.value;
      return this.ok(res, developers);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
