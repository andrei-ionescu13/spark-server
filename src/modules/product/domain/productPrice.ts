import z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import { Result } from '../../../results';
import { zodDomainValidationError } from '../../../zodErrors';

interface ProductPriceProps {
  value: number;
}

export class ProductPrice extends ValueObject<ProductPriceProps> {
  private constructor(props: ProductPriceProps) {
    super(props);
  }

  static create(value: number): Result<ProductPrice, DomainValidationError> {
    const schema = z.number().positive();
    const result = schema.safeParse(value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new ProductPrice({ value }));
  }

  static reconstitute(value: number): ProductPrice {
    return new ProductPrice({ value });
  }

  get value() {
    return this.props.value;
  }
}
