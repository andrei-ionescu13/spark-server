import z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../blog/article/valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

interface DiscountTypeProps {
  value: 'amount' | 'percentage';
}

export class DiscountType extends ValueObject<DiscountTypeProps> {
  private constructor(props: DiscountTypeProps) {
    super(props);
  }

  static create(value: string): Result<DiscountType, DomainValidationError> {
    const schema = z.enum(['amount', 'percentage']);
    const result = schema.safeParse(value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new DiscountType({ value: result.data }));
  }

  get value() {
    return this.props.value;
  }
}
