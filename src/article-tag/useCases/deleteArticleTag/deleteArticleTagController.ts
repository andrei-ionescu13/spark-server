import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteArticleTagRequestDto } from './deleteArticleTagRequestDto';
import { DeleteArticleTagErrors, DeleteArticleTagUseCase } from './deleteArticleTagUseCase';

export class DeleteArticleTagController extends BaseController {
  constructor(private useCase: DeleteArticleTagUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteArticleTagRequestDto = {
      articleTagId: req.params.articleTagId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case DeleteArticleTagErrors.ArticleTagInUse:
            return this.forbidden(res, error.getErrorValue().message);

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
