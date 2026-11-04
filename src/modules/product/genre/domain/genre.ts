import * as z from 'zod';
import { textUtils } from '../../../../utils/textUtils';
import { DomainValidationError } from '../../../blog/article/domain/status';
import { v7 as uuid7 } from 'uuid';
import { zodDomainValidationError } from '../../../../zodErrors';
import { Result } from '../../../../result';

interface GenreProps {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface GenreCreateProps extends Omit<GenreProps, 'slug' | 'updatedAt' | 'createdAt' | '_id'> {
  slug?: string;
}

export class Genre {
  constructor(private props: GenreProps) {}

  static create(props: GenreCreateProps): Result<Genre, DomainValidationError> {
    const schema = z.object({
      name: z.string().min(1),
      slug: z.string().optional(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Genre({
        ...props,
        slug: props.slug || textUtils.generateSlug(props.name),
        updatedAt: null,
        _id: uuid7(),
        createdAt: new Date(),
      }),
    );
  }

  public static reconstitute(props: GenreProps) {
    return new Genre(props);
  }

  public update(name: string, slug: string): Result<undefined, DomainValidationError> {
    const schema = z.object({
      name: z.string().min(3),
      slug: z.string().optional(),
    });

    const result = schema.safeParse({ name, slug });

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    this.props.name = name;
    this.props.slug = slug;
    this.props.updatedAt = new Date();

    return Result.ok();
  }

  get _id() {
    return this.props._id;
  }

  get name() {
    return this.props.name;
  }

  get slug() {
    return this.props.slug;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
