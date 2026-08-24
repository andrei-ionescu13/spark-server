import { Request, Response } from 'express';
import { CreateDealRequestDto } from './createDealRequestDto';
import { CreateDealUseCase } from './createDealUseCase';
import { Controller } from '../../../Controller';

export class CreateDealController extends Controller {
  constructor(private useCase: CreateDealUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: CreateDealRequestDto = {
      coverFile: req.file as Express.Multer.File,
      description: body.description,
      products: body.products,
      slug: body.slug,
      startDate: body.startDate,
      title: body.title,
      endDate: body.endDate,
      meta: {
        description: body.meta.description,
        keywords: body.meta.keywords,
        title: body.meta.title,
      },
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const _id = result.value;
      return this.ok(res, { _id });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
