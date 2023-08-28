import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DuplicateArticleRequestDto } from './duplicateArticleRequestDto';
import { DuplicateArticleErrors, DuplicateArticleUseCase } from './duplicateArticleUseCase';

export class DuplicateArticleController extends BaseController {
  constructor(private useCase: DuplicateArticleUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DuplicateArticleRequestDto = {
      articleId: req.params.articleId,
      slug: req.body.slug,
      title: req.body.title,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case DuplicateArticleErrors.TitleNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          case DuplicateArticleErrors.SlugNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          default:
            return this.fail(res, error.getErrorValue().message);
        }
      }

      const id = result.value.getValue();

      return this.ok(res, { id });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
