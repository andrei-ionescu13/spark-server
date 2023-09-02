import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { AddOperatingSystemRequestDto } from './addOperatingSystemRequestDto';
import { AddOperatingSystemUseCase } from './addOperatingSystemUseCase';

export class AddOperatingSystemController extends BaseController {
  constructor(private useCase: AddOperatingSystemUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: AddOperatingSystemRequestDto = {
      name: req.body.name,
      slug: req.body?.slug,
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

      const operatingSystem = result.value.getValue();

      return this.ok(res, { operatingSystem });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
