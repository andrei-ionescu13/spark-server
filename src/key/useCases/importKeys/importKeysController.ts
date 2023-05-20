import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { ImportKeysRequestDto } from './importKeysRequestDto';
import { ImportKeysUseCase } from './importKeysUseCase';

export class ImportKeysController extends BaseController {
  constructor(private useCase: ImportKeysUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: ImportKeysRequestDto = {
      keysFile: req.file as Express.Multer.File,
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

      return this.ok(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
