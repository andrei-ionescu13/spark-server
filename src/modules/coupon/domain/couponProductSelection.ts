import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import { Result } from '../../../results';
import { zodDomainValidationError } from '../../../zodErrors';

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

  public static reconstitute(
    productSelection: CouponProductSelectionValue,
  ): CouponProductSelection {
    return new CouponProductSelection({ value: productSelection });
  }

  get value() {
    return this.props.value;
  }
}
