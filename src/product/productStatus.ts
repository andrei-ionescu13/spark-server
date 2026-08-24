import z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

interface ProductStatusProps {
  value: 'draft' | 'published' | 'archived';
}

export class ProductStatus extends ValueObject<ProductStatusProps> {
  private constructor(props: ProductStatusProps) {
    super(props);
  }

  static create(value: string): Result<ProductStatus, DomainValidationError> {
    const schema = z.enum(['draft', 'published', 'archived']);
    const result = schema.safeParse(value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new ProductStatus({ value: result.data }));
  }

  get value() {
    return this.props.value;
  }
}
