import { Request, Response } from 'express';
import { Controller } from '../../../../Controller';
import { ListArticleCategoriesUseCase } from './listArticleCategoriesUseCase';

export class ListArticleCategoriesController extends Controller {
  constructor(private useCase: ListArticleCategoriesUseCase) {
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

      const articleCategories = result.value;

      return this.ok(res, articleCategories);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
