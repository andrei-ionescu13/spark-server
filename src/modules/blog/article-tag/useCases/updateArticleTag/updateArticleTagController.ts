import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { zodRequestValidationError } from '../../../../../zodErrors';
import { UpdateArticleTagErrors, UpdateArticleTagUseCase } from './updateArticleTagUseCase';

const schema = z.object({
  articleTagId: z.uuidv7(),
  name: z.string(),
  slug: z.string(),
});

export type UpdateArticleTagRequestDto = z.infer<typeof schema>;

export class UpdateArticleTagController extends Controller {
  constructor(private useCase: UpdateArticleTagUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      ...req.body,
      articleTagId: req.params.articleTagId,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          case UpdateArticleTagErrors.NameNotAvailableError:
            return this.forbidden(res, error.message);

          case UpdateArticleTagErrors.SlugNotAvailableError:
            return this.forbidden(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const articleTag = result.value;

      return this.ok(res, { name: articleTag.props.slug });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
