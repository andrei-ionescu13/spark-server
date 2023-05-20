import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateCollectionRequestDto } from './updateCollectionRequestDto';
import { UpdateCollectionUseCase } from './updateCollectionUseCase';
import { AppError } from '../../../AppError';

export class UpdateCollectionController extends BaseController {
  constructor(private useCase: UpdateCollectionUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: UpdateCollectionRequestDto = {
      collectionId: req.params.collectionId,
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
          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const value = result.value.getValue();

      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
