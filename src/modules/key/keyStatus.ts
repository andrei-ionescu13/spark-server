import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../../valueObject';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';

type KeyStatusValue = 'secret' | 'revealed' | 'reported';

interface KeyStatusProps {
  value: KeyStatusValue;
}

export class KeyStatus extends ValueObject<KeyStatusProps> {
  private constructor(props: KeyStatusProps) {
    super(props);
  }

  static create(status?: KeyStatusValue): Result<KeyStatus, DomainValidationError> {
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
