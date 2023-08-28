import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { ListArticleCategoriesRequestDto } from './listArticleCategoriesRequestDto';
import { ListArticleCategoriesUseCase } from './listArticleCategoriesUseCase';

export class ListArticleCategoriesController extends BaseController {
  constructor(private useCase: ListArticleCategoriesUseCase) {
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

      const articleCategories = result.value.getValue();

      return this.ok(res, articleCategories);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
