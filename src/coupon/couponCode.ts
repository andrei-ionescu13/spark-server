import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../blog/article/valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

export class CouponCode extends ValueObject<{ value: string }> {
  constructor(props: { value: string }) {
    super(props);
  }

  static create(code: string): Result<CouponCode, DomainValidationError> {
    const schema = z.string().min(3);
    const validation = schema.safeParse(code);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new CouponCode({ value: code }));
  }

  get value() {
    return this.props.value;
  }
}
