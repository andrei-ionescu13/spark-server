import z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import { Result } from '../../../result';
import { zodDomainValidationError } from '../../../zodErrors';

interface DiscountTitleProps {
  value: string;
}

export class DiscountTitle extends ValueObject<DiscountTitleProps> {
  private constructor(props: DiscountTitleProps) {
    super(props);
  }

  static create(value: string): Result<DiscountTitle, DomainValidationError> {
    const schema = z.string().min(1);
    const result = schema.safeParse(value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new DiscountTitle({ value: result.data }));
  }

  static reconstitute(value: string): DiscountTitle {
    return new DiscountTitle({ value });
  }

  get value() {
    return this.props.value;
  }
}
