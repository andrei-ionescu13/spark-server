import z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import { Result } from '../../../result';
import { zodDomainValidationError } from '../../../zodErrors';

type ProductStatusValue = 'draft' | 'published' | 'archived';

interface ProductStatusProps {
  value: ProductStatusValue;
}

export class ProductStatus extends ValueObject<ProductStatusProps> {
  private constructor(props: ProductStatusProps) {
    super(props);
  }

  static create(value: ProductStatusValue): Result<ProductStatus, DomainValidationError> {
    const schema = z.enum(['draft', 'published', 'archived']);
    const result = schema.safeParse(value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new ProductStatus({ value: result.data }));
  }

  static createDefault() {
    return new ProductStatus({ value: 'draft' });
  }

  static reconstitute(value: ProductStatusValue): ProductStatus {
    return new ProductStatus({ value });
  }

  get value() {
    return this.props.value;
  }
}
