import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteArticleRequestDto } from './deleteArticleRequestDto';
import { DeleteArticleUseCase } from './deleteArticleUseCase';

export class DeleteArticleController extends BaseController {
  constructor(private useCase: DeleteArticleUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteArticleRequestDto = {
      articleId: req.params.articleId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value.getErrorValue();

        switch (error.constructor) {
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
