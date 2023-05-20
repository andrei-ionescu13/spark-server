import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { CreateTranslationRequestDto } from './createTranslationRequestDto';
import { CreateTranslationUseCase } from './createTranslationUseCase';

export class CreateTranslationController extends BaseController {
  constructor(private useCase: CreateTranslationUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: CreateTranslationRequestDto = {
      namespaceId: req.params.namespaceId,
      key: req.body.key,
      ...req.body,
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

      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
