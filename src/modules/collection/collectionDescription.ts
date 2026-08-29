import z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../../valueObject';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';

interface CollectionDescriptionProps {
  value: string | null;
}

export class CollectionDescription extends ValueObject<CollectionDescriptionProps> {
  private constructor(props: CollectionDescriptionProps) {
    super(props);
  }

  static create(value: string | null): Result<CollectionDescription, DomainValidationError> {
    const schema = z.string().min(8).nullable();
    const result = schema.safeParse(value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new CollectionDescription({ value: result.data }));
  }

  get value() {
    return this.props.value;
  }
}
