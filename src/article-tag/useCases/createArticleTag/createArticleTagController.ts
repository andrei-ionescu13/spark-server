import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { CreateArticleTagRequestDto } from './createArticleTagRequestDto';
import { CreateArticleTagErrors, CreateArticleTagUseCase } from './createArticleTagUseCase';

export class CreateArticleTagController extends BaseController {
  constructor(private useCase: CreateArticleTagUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: CreateArticleTagRequestDto = {
      name: req.body.name,
      slug: req.body.slug,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateArticleTagErrors.NameNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          case CreateArticleTagErrors.SlugNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const articleTagName = result.value.getValue();

      return this.ok(res, { name: articleTagName });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
