import z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import { Result } from '../../../results';
import { zodDomainValidationError } from '../../../zodErrors';

interface CollectionDescriptionProps {
  value: string;
}

export class CollectionDescription extends ValueObject<CollectionDescriptionProps> {
  private constructor(props: CollectionDescriptionProps) {
    super(props);
  }

  static create(value: string): Result<CollectionDescription, DomainValidationError> {
    const schema = z.string().min(1);
    const result = schema.safeParse(value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new CollectionDescription({ value: result.data }));
  }

  static reconstitute(value: string): CollectionDescription {
    return new CollectionDescription({ value });
  }

  get value() {
    return this.props.value;
  }
}
