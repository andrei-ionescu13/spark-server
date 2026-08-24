import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

interface KeyValueProps {
  value: string;
}

export class KeyValue extends ValueObject<KeyValueProps> {
  private constructor(props: KeyValueProps) {
    super(props);
  }

  static create(status: string): Result<KeyValue, DomainValidationError> {
    const schema = z.string().min(1);
    const result = schema.safeParse(status);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new KeyValue({ value: status }));
  }

  get value() {
    return this.props.value;
  }
}
