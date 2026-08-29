import { Request, Response } from 'express';
import { Controller } from '../../../../../Controller';
import { ListArticleTagsUseCase } from './listArticleTagsUseCase';

export class ListArticleTagsController extends Controller {
  constructor(private useCase: ListArticleTagsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    try {
      const result = await this.useCase.execute();

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const articleTags = result.value;

      return this.ok(res, articleTags);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
