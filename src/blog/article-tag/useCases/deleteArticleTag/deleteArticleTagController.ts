import { Request, Response } from 'express';
import { Controller } from '../../../../Controller';
import { DeleteArticleTagRequestDto } from './deleteArticleTagRequestDto';
import { DeleteArticleTagErrors, DeleteArticleTagUseCase } from './deleteArticleTagUseCase';

export class DeleteArticleTagController extends Controller {
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

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          case DeleteArticleTagErrors.ArticleTagInUse:
            return this.forbidden(res, error.message);

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
