import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../../valueObject';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';

type CouponTypeValue = 'amount' | 'percentage';

export class CouponType extends ValueObject<{ value: CouponTypeValue }> {
  constructor(props: { value: CouponTypeValue }) {
    super(props);
  }

  static create(type: CouponTypeValue): Result<CouponType, DomainValidationError> {
    const schema = z.enum(['amount', 'percentage']);
    const validation = schema.safeParse(type);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new CouponType({ value: type }));
  }

  get value() {
    return this.props.value;
  }
}
