import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { ListPublishersRequestDto } from './listPublishersRequestDto';
import { ListPublishersUseCase } from './listPublishersUseCase';

export class ListPublishersController extends BaseController {
  constructor(private useCase: ListPublishersUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: ListPublishersRequestDto = {};

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const publishers = result.value.getValue();

      return this.ok(res, publishers);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
