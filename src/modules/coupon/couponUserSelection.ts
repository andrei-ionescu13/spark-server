import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../../valueObject';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';

type CouponUserSelectionValue = 'general' | 'selected';

export class CouponUserSelection extends ValueObject<{ value: CouponUserSelectionValue }> {
  constructor(props: { value: CouponUserSelectionValue }) {
    super(props);
  }

  static create(
    userSelection: CouponUserSelectionValue,
  ): Result<CouponUserSelection, DomainValidationError> {
    const schema = z.enum(['general', 'selected']);
    const validation = schema.safeParse(userSelection);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new CouponUserSelection({ value: userSelection }));
  }

  get value() {
    return this.props.value;
  }
}
