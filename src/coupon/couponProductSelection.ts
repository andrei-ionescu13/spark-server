import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

export class CouponProductSelection extends ValueObject<{ value: string }> {
  constructor(props: { value: string }) {
    super(props);
  }

  static create(productSelection: string): Result<CouponProductSelection, DomainValidationError> {
    const schema = z.enum(['general', 'selected']);
    const validation = schema.safeParse(productSelection);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new CouponProductSelection({ value: productSelection }));
  }

  get value() {
    return this.props.value;
  }
}
