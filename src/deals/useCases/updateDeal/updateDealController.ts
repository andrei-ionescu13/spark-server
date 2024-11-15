import { Request, Response } from 'express';
import { AppError } from '../../../AppError';
import { BaseController } from '../../../BaseController';
import { UpdateDealRequestDto } from './updateDealRequestDto';
import { UpdateDealUseCase } from './updateDealUseCase';

export class UpdateDealController extends BaseController {
  constructor(private useCase: UpdateDealUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: UpdateDealRequestDto = {
      dealId: req.params.dealId,
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
