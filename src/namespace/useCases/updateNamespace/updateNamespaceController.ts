import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateNamespaceRequestDto } from './updateNamespaceRequestDto';
import { UpdateNamespaceUseCase } from './updateNamespaceUseCase';

export class UpdateNamespaceController extends BaseController {
  constructor(private useCase: UpdateNamespaceUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: UpdateNamespaceRequestDto = {
      namespaceId: req.params.namespaceId,
      name: req.body.name,
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
