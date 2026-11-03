import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { zodRequestValidationError } from '../../../../../zodErrors';
import { UpdateArticleTagRequestDto } from './updateArticleTagRequestDto';
import { UpdateArticleTagErrors, UpdateArticleTagUseCase } from './updateArticleTagUseCase';

export class UpdateArticleTagController extends Controller {
  constructor(private useCase: UpdateArticleTagUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      articleTagId: z.string(),
      name: z.string(),
      slug: z.string(),
    });

    const result = schema.safeParse({
      ...req.body,
      articleTagId: req.params.articleTagId,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: UpdateArticleTagRequestDto = result.data;

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
