import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../../valueObject';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';

type CouponProductSelectionValue = 'general' | 'selected';

export class CouponProductSelection extends ValueObject<{ value: CouponProductSelectionValue }> {
  constructor(props: { value: CouponProductSelectionValue }) {
    super(props);
  }

  static create(
    productSelection: CouponProductSelectionValue,
  ): Result<CouponProductSelection, DomainValidationError> {
    const schema = z.enum(['general', 'selected']);
    const validation = schema.safeParse(productSelection);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new CouponProductSelection({ value: productSelection }));
  }

  get value() {
    return this.props.value;
  }
}
