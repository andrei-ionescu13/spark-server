import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../blog/article/valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

export class UserEmail extends ValueObject<{ value: string }> {
  constructor(props: { value: string }) {
    super(props);
  }

  static create(email: string): Result<UserEmail, DomainValidationError> {
    const schema = z.email();
    const validation = schema.safeParse(email);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new UserEmail({ value: email }));
  }

  get value() {
    return this.props.value;
  }
}
