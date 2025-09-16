import z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../blog/article/valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

interface ProductLinkProps {
  value: string;
}

export class ProductLink extends ValueObject<ProductLinkProps> {
  private constructor(props: ProductLinkProps) {
    super(props);
  }

  static create(value: string): Result<ProductLink, DomainValidationError> {
    const schema = z.url();
    const result = schema.safeParse(value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new ProductLink({ value: result.data }));
  }

  get value() {
    return this.props.value;
  }
}
