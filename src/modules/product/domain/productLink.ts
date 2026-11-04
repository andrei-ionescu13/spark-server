import z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import { Result } from '../../../results';
import { zodDomainValidationError } from '../../../zodErrors';

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

  static reconstitute(value: string): ProductLink {
    return new ProductLink({ value });
  }

  get value() {
    return this.props.value;
  }
}
