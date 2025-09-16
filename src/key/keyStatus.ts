import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../blog/article/valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

interface KeyStatusProps {
  value: string;
}

export class KeyStatus extends ValueObject<KeyStatusProps> {
  private constructor(props: KeyStatusProps) {
    super(props);
  }

  static create(status?: string): Result<KeyStatus, DomainValidationError> {
    const schema = z.enum(['secret', 'revealed', 'reported']).optional();
    const result = schema.safeParse(status);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    if (!status) return Result.ok(new KeyStatus({ value: 'secret' }));

    return Result.ok(new KeyStatus({ value: status }));
  }

  get value() {
    return this.props.value;
  }
}
