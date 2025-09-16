import z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../blog/article/valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

interface ProductRequirementsProps {
  value: string;
}

export class ProductRequirements extends ValueObject<ProductRequirementsProps> {
  private constructor(props: ProductRequirementsProps) {
    super(props);
  }

  static create(value: string): Result<ProductRequirements, DomainValidationError> {
    const schema = z.string().min(1).max(1024);
    const result = schema.safeParse(value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new ProductRequirements({ value: result.data }));
  }

  get value() {
    return this.props.value;
  }
}
