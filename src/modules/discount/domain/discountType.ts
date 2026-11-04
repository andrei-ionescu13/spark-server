import z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import { Result } from '../../../result';
import { zodDomainValidationError } from '../../../zodErrors';

type DiscountTypevalue = 'amount' | 'percentage';

interface DiscountTypeProps {
  value: DiscountTypevalue;
}

export class DiscountType extends ValueObject<DiscountTypeProps> {
  private constructor(props: DiscountTypeProps) {
    super(props);
  }

  static create(value: DiscountTypevalue): Result<DiscountType, DomainValidationError> {
    const schema = z.enum(['amount', 'percentage']);
    const result = schema.safeParse(value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new DiscountType({ value: result.data }));
  }

  static reconstitute(value: DiscountTypevalue): DiscountType {
    return new DiscountType({ value });
  }

  get value() {
    return this.props.value;
  }
}
