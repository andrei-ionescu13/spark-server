import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateArticleCategoryRequestDto } from './updateArticleCategoryRequestDto';
import { UpdateArticleCategoryUseCase } from './updateArticleCategoryUseCase';
import { AppError } from '../../../AppError';
import { CreateArticleCategoryErrors } from '../createArticleCategory/createArticleCategoryUseCase';

export class UpdateArticleCategoryController extends BaseController {
  constructor(private useCase: UpdateArticleCategoryUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: UpdateArticleCategoryRequestDto = {
      articleCategoryId: req.params.articleCategoryId,
      name: body.name,
      slug: body.slug,
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

      const articleCategory = result.value.getValue();

      return this.ok(res, articleCategory);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
