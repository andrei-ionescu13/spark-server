import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { CreateArticleCategoryRequestDto } from './createArticleCategoryRequestDto';
import {
  CreateArticleCategoryErrors,
  CreateArticleCategoryUseCase,
} from './createArticleCategoryUseCase';

export class CreateArticleCategoryController extends BaseController {
  constructor(private useCase: CreateArticleCategoryUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: CreateArticleCategoryRequestDto = {
      name: req.body.name,
      slug: req.body.slug,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateArticleCategoryErrors.NameNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          case CreateArticleCategoryErrors.SlugNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const articleCategoryName = result.value.getValue();

      return this.ok(res, { name: articleCategoryName });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
