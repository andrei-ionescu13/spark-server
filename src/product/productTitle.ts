import z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

interface ProductTitleProps {
  value: string;
}

export class ProductTitle extends ValueObject<ProductTitleProps> {
  private constructor(props: ProductTitleProps) {
    super(props);
  }

  static create(value: string): Result<ProductTitle, DomainValidationError> {
    const schema = z.string().min(1);
    const result = schema.safeParse(value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new ProductTitle({ value: result.data }));
  }

  get value() {
    return this.props.value;
  }
}
