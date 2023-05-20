import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { CreatePublisherRequestDto } from './createPublisherRequestDto';
import { CreatePublisherUseCase } from './createPublisherUseCase';

export class CreatePublisherController extends BaseController {
  constructor(private useCase: CreatePublisherUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: CreatePublisherRequestDto = {
      name: req.body.name,
      logoFile: req.file,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const publisher = result.value.getValue();

      return this.ok(res, { publisher });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
