import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { GetArticleRequestDto } from './GetArticleRequestDto';
import { GetArticleUseCase } from './GetArticleUseCase';

export class GetArticleController extends Controller {
  constructor(private useCase: GetArticleUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetArticleRequestDto = { articleId: req.params.articleId };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const value = result._value;

      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
