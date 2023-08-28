import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteDeveloperRequestDto } from './deleteDeveloperRequestDto';
import { DeleteDeveloperErrors, DeleteDeveloperUseCase } from './deleteDeveloperUseCase';

export class DeleteDeveloperController extends BaseController {
  constructor(private useCase: DeleteDeveloperUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteDeveloperRequestDto = {
      developerId: req.params.developerId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case DeleteDeveloperErrors.DeveloperInUse:
            return this.forbidden(res, error.getErrorValue().message);

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
