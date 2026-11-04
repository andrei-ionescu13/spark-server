import { ValueObject } from '../../../valueObject';
import * as z from 'zod';
import { zodDomainValidationError } from '../../../zodErrors';
import { DomainValidationError } from '../../blog/article/domain/status';
import { Result } from '../../../results';

export class AdminUsername extends ValueObject<{ value: string }> {
  constructor(props: { value: string }) {
    super(props);
  }

  static create(value: string): Result<AdminUsername, DomainValidationError> {
    const schema = z.string().min(1);
    const validation = schema.safeParse(value);

    if (validation.error) {
      return Result.fail(zodDomainValidationError(validation.error));
    }

    return Result.ok(new AdminUsername({ value }));
  }

  static recreate(value: string): AdminUsername {
    return new AdminUsername({ value });
  }

  get value() {
    return this.props.value;
  }
}
