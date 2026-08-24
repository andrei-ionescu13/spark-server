import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

export class CouponType extends ValueObject<{ value: string }> {
  constructor(props: { value: string }) {
    super(props);
  }

  static create(type: string): Result<CouponType, DomainValidationError> {
    const schema = z.enum(['amount', 'percentage']);
    const validation = schema.safeParse(type);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new CouponType({ value: type }));
  }

  get value() {
    return this.props.value;
  }
}
