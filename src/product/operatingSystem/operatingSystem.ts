import * as z from 'zod';
import { textUtils } from '../../../utils/textUtils';
import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';

interface OperatingSystemProps {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface OperatingSystemCreateProps extends Omit<OperatingSystemProps, 'slug' | 'updatedAt'> {
  slug?: string;
  updatedAt?: Date | null;
}

export class OperatingSystem {
  constructor(private props: OperatingSystemProps) {}

  static create(props: OperatingSystemCreateProps): Result<OperatingSystem, DomainValidationError> {
    const schema = z.object({
      _id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date().optional(),
      name: z.string().min(3),
      slug: z.string().optional(),
    });

    const result = schema.safeParse(props.name);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new OperatingSystem({
        ...props,
        slug: props.slug || textUtils.generateSlug(props.name),
        updatedAt: props.updatedAt || null,
      }),
    );
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
