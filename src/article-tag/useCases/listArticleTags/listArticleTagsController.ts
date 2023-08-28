import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { ListArticleTagsRequestDto } from './listArticleTagsRequestDto';
import { ListArticleTagsUseCase } from './listArticleTagsUseCase';

export class ListArticleTagsController extends BaseController {
  constructor(private useCase: ListArticleTagsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    try {
      const result = await this.useCase.execute();

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const articleTags = result.value.getValue();

      return this.ok(res, articleTags);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
