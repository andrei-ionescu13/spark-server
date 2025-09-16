import { Request, Response } from 'express';
import { Controller } from '../../../../Controller';
import { DeleteArticleRequestDto } from './deleteArticleRequestDto';
import { DeleteArticleUseCase } from './deleteArticleUseCase';

export class DeleteArticleController extends Controller {
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

      if (result.isErr()) {
        const { error } = result;

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
