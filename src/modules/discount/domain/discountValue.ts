import z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import { Result } from '../../../results';
import { zodDomainValidationError } from '../../../zodErrors';

interface DiscountValueProps {
  value: number;
}

export class DiscountValue extends ValueObject<DiscountValueProps> {
  private constructor(props: DiscountValueProps) {
    super(props);
  }

  static create(value: number): Result<DiscountValue, DomainValidationError> {
    const schema = z.number().min(1);
    const result = schema.safeParse(value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new DiscountValue({ value: result.data }));
  }

  static reconstitute(value: number): DiscountValue {
    return new DiscountValue({ value });
  }

  get value() {
    return this.props.value;
  }
}
