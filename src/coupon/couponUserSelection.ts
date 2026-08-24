import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

export class CouponUserSelection extends ValueObject<{ value: string }> {
  constructor(props: { value: string }) {
    super(props);
  }

  static create(userSelection: string): Result<CouponUserSelection, DomainValidationError> {
    const schema = z.enum(['general', 'selected']);
    const validation = schema.safeParse(userSelection);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new CouponUserSelection({ value: userSelection }));
  }

  get value() {
    return this.props.value;
  }
}
