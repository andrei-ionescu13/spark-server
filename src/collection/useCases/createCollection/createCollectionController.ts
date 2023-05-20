import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { CreateCollectionRequestDto } from './createCollectionRequestDto';
import { CreateCollectionUseCase } from './createCollectionUseCase';

export class CreateCollectionController extends BaseController {
  constructor(private useCase: CreateCollectionUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: CreateCollectionRequestDto = {
      coverFile: req.file as Express.Multer.File,
      description: body.description,
      isDeal: JSON.parse(body.isDeal),
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

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const value = result.value.getValue();

      return this.ok(res, {});
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
