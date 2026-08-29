import z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../../valueObject';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';

interface CollectionTitleProps {
  value: string;
}

export class CollectionTitle extends ValueObject<CollectionTitleProps> {
  private constructor(props: CollectionTitleProps) {
    super(props);
  }

  static create(value: string): Result<CollectionTitle, DomainValidationError> {
    const schema = z.string().min(1);
    const result = schema.safeParse(value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new CollectionTitle({ value: result.data }));
  }

  get value() {
    return this.props.value;
  }
}
