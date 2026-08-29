import z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../../valueObject';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';

interface ProductMarkdownProps {
  value: string;
}

export class ProductMarkdown extends ValueObject<ProductMarkdownProps> {
  private constructor(props: ProductMarkdownProps) {
    super(props);
  }

  static create(value: string): Result<ProductMarkdown, DomainValidationError> {
    const schema = z.string().min(255).max(2048);
    const result = schema.safeParse(value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new ProductMarkdown({ value: result.data }));
  }

  get value() {
    return this.props.value;
  }
}
