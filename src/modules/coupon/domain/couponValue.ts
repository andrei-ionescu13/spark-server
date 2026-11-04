import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import { Result } from '../../../results';
import { zodDomainValidationError } from '../../../zodErrors';

export class CouponValue extends ValueObject<{ value: number }> {
  constructor(props: { value: number }) {
    super(props);
  }

  static create(value: number): Result<CouponValue, DomainValidationError> {
    const schema = z.number().positive();
    const validation = schema.safeParse(value);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new CouponValue({ value }));
  }

  public static reconstitute(value: number): CouponValue {
    return new CouponValue({ value });
  }

  get value() {
    return this.props.value;
  }
}
