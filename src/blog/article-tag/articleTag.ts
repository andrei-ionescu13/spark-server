import * as z from 'zod';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';

interface ArticleTagProps {
  _id: string;
  name?: string;
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date | null;
}

export class ArticleTag {
  constructor(public readonly props: ArticleTagProps) {}

  public create = (props: ArticleTagProps): Result<ArticleTag, Error> => {
    const schema = z.object({
      name: z.string().min(3),
      createdAt: z.date(),
    });

    const result = schema.safeParse(props.name);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new ArticleTag(props));
  };
}
