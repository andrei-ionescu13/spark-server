import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateDeveloperRequestDto } from './updateDeveloperRequestDto';
import { UpdateDeveloperErrors, UpdateDeveloperUseCase } from './updateDeveloperUseCase';
import { AppError } from '../../../AppError';

export class UpdateDeveloperController extends BaseController {
  constructor(private useCase: UpdateDeveloperUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: UpdateDeveloperRequestDto = {
      developerId: req.params.developerId,
      name: body.name,
      slug: body.slug,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case UpdateDeveloperErrors.NameNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          case UpdateDeveloperErrors.SlugNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const developer = result.value.getValue();

      return this.ok(res, { name: developer.name });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
