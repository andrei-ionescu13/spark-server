import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { GetArticleRequestDto } from './GetArticleRequestDto';
import { GetArticleUseCase } from './GetArticleUseCase';
import { AppError } from '../../../AppError';

export class GetArticleController extends BaseController {
  constructor(private useCase: GetArticleUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetArticleRequestDto = { articleId: req.params.articleId };

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

      const value = result.value.getValue();

      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
