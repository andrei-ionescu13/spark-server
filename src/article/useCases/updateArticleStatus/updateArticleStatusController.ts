import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { AppError } from '../../../AppError';
import { UpdateArticleStatusRequestDto } from './updateArticleStatusRequestDto';
import { UpdateArticleStatusUseCase } from './updateArticleStatusUseCase';

export class UpdateArticleStatusController extends BaseController {
  constructor(private useCase: UpdateArticleStatusUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: UpdateArticleStatusRequestDto = {
      articleId: req.params.articleId,
      status: req.body.status,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }
      const status = result.value.getValue();

      return this.ok(res, { status });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
