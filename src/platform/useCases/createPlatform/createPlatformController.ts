import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { CreatePlatformRequestDto } from './createPlatformRequestDto';
import { CreatePlatformUseCase } from './createPlatformUseCase';

export class CreatePlatformController extends BaseController {
  constructor(private useCase: CreatePlatformUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: CreatePlatformRequestDto = {
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

      const platform = result.value.getValue();

      return this.ok(res, platform);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
