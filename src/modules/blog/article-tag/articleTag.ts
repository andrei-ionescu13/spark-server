import * as z from 'zod';
import { zodDomainValidationError } from '../../../zodErrors';
import { textUtils } from '../../../../utils/textUtils';
import { DomainValidationError } from '../article/status';
import { Result } from '../../../result';
import { v7 as uuid7 } from 'uuid';

interface ArticleTagProps {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface CreateArticleTagProps extends Omit<ArticleTagProps, 'createdAt' | '_id'> {}

export class ArticleTag {
  constructor(public readonly props: ArticleTagProps) {}

  public static create = (props: CreateArticleTagProps): Result<ArticleTag, Error> => {
    const schema = z.object({
      name: z.string().min(3),
      createdAt: z.date(),
    });

    const result = schema.safeParse(props.name);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new ArticleTag({
        ...props,
        slug: props.slug || textUtils.generateSlug(props.name),
        createdAt: new Date(),
        _id: uuid7(),
      }),
    );
  };

  public static reconstitute(props: ArticleTagProps) {
    return new ArticleTag(props);
  }

  public updateNameAndSlug(name: string, slug: string): Result<undefined, DomainValidationError> {
    const schema = z.object({
      name: z.string().min(3),
      slug: z.string().min(3),
    });

    const result = schema.safeParse({ name, slug });

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    this.name = name;
    this.slug = slug;

    return Result.ok();
  }

  get _id() {
    return this.props._id;
  }

  get name() {
    return this.props.name;
  }

  set name(value: string) {
    this.name = value;
  }

  get slug() {
    return this.props.slug;
  }

  set slug(value: string) {
    this.slug = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
