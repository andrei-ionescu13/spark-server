import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import { Result } from '../../../result';
import { zodDomainValidationError } from '../../../zodErrors';

interface KeyValueProps {
  value: string;
}

export class KeyValue extends ValueObject<KeyValueProps> {
  private constructor(props: KeyValueProps) {
    super(props);
  }

  static create(value: string): Result<KeyValue, DomainValidationError> {
    const schema = z.string().min(4);
    const result = schema.safeParse(value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new KeyValue({ value: value }));
  }

  static reconstitute(value: string): KeyValue {
    return new KeyValue({ value: value });
  }

  get value() {
    return this.props.value;
  }
}
