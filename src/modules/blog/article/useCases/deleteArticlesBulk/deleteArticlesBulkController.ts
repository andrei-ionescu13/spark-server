import { Request, Response } from 'express';
import { Controller } from '../../../../../controller';
import { DeleteArticlesBulkUseCase } from './deleteArticlesBulkUseCase';
import * as z from 'zod';

const schema = z.object({
  ids: z.array(z.string()),
});

export type DeleteArticlesBulkRequestDto = z.infer<typeof schema>;

export class DeleteArticlesBulkController extends Controller {
  constructor(private useCase: DeleteArticlesBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto = { ids: req.body.ids };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      return this.noContent(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
