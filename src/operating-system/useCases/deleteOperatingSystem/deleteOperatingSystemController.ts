import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteOperatingSystemRequestDto } from './deleteOperatingSystemRequestDto';
import { DeleteOperatingSystemUseCase } from './deleteOperatingSystemUseCase';

export class DeleteOperatingSystemController extends BaseController {
  constructor(private useCase: DeleteOperatingSystemUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteOperatingSystemRequestDto = {
      operatingSystemId: req.params.operatingSystemId,
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

      return this.noContent(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
