import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { CreateDeveloperRequestDto } from './createDeveloperRequestDto';
import { CreateDeveloperErrors, CreateDeveloperUseCase } from './createDeveloperUseCase';

export class CreateDeveloperController extends BaseController {
  constructor(private useCase: CreateDeveloperUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: CreateDeveloperRequestDto = {
      name: req.body.name,
      slug: req.body.slug,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateDeveloperErrors.NameNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          case CreateDeveloperErrors.SlugNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const developerName = result.value.getValue();

      return this.ok(res, { name: developerName });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
