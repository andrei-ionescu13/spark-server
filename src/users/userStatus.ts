import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../blog/article/valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

type UserStatusValue = 'active' | 'inactive' | 'banned';

export class UserStatus extends ValueObject<{ value: UserStatusValue }> {
  constructor(props: { value: UserStatusValue }) {
    super(props);
  }

  static create(status: UserStatusValue = 'inactive'): Result<UserStatus, DomainValidationError> {
    const schema = z.enum(['active', 'inactive', 'banned']);
    const validation = schema.safeParse(status);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new UserStatus({ value: validation.data }));
  }

  get value() {
    return this.props.value;
  }
}
