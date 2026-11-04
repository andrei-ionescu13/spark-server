import * as z from 'zod';
import { DomainValidationError } from './modules/blog/article/domain/status';
import { ValueObject } from './valueObject';
import { Result } from './results';
import { zodDomainValidationError } from './zodErrors';

interface MetaProps {
  title: string;
  description: string;
  keywords: string[];
}

export class Meta extends ValueObject<MetaProps> {
  constructor(props: MetaProps) {
    super(props);
  }

  static create(props: MetaProps): Result<Meta, DomainValidationError> {
    const schema = z.object({
      title: z.string().min(1).max(120),
      description: z.string().min(1).max(1024),
      keywords: z.array(z.string().min(1)).min(1),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new Meta(props));
  }

  public static reconstitute(props: MetaProps) {
    return new Meta(props);
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get keywords() {
    return this.props.keywords;
  }
}

export interface MetaDoc {
  title: string;
  description: string;
  keywords: string[];
}
