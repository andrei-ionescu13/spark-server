import { Request, Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../../Controller';
import { zodRequestValidationError } from '../../../../zodErrors';
import { CreateArticleTagRequestDto } from './createArticleTagRequestDto';
import { CreateArticleTagErrors, CreateArticleTagUseCase } from './createArticleTagUseCase';

export class CreateArticleTagController extends Controller {
  constructor(private useCase: CreateArticleTagUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string(),
      slug: z.string().optional(),
    });

    const result = schema.safeParse({ name: req.body.name, slug: req.body.slug });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: CreateArticleTagRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          case CreateArticleTagErrors.NameNotAvailableError:
            return this.forbidden(res, error.message);

          case CreateArticleTagErrors.SlugNotAvailableError:
            return this.forbidden(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const articleTagName = result.value;

      return this.ok(res, { name: articleTagName });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
