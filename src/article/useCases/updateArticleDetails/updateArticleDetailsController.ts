import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateArticleDetailsRequestDto } from './updateArticleDetailsRequestDto';
import { UpdateArticleDetailsUseCase } from './updateArticleDetailsUseCase';

export class UpdateArticleDetailsController extends BaseController {
  constructor(private useCase: UpdateArticleDetailsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: UpdateArticleDetailsRequestDto = {
      articleId: req.params.articleId,
      description: body.description,
      markdown: body.markdown,
      slug: body.slug,
      title: body.title,
      cover: body.cover,
      file: req.file,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value.getErrorValue();

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const article = result.value.getValue();
      const { description, title, slug, markdown, cover, updatedAt } = article;

      return this.ok(res, { description, title, slug, markdown, cover, updatedAt });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
