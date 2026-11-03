import z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import { Result } from '../../../result';
import { zodDomainValidationError } from '../../../zodErrors';

interface ProductMarkdownProps {
  value: string;
}

export class ProductMarkdown extends ValueObject<ProductMarkdownProps> {
  private constructor(props: ProductMarkdownProps) {
    super(props);
  }

  static create(value: string): Result<ProductMarkdown, DomainValidationError> {
    const schema = z.string().min(8);
    const result = schema.safeParse(value);

    if (result.error) {
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new ProductMarkdown({ value: result.data }));
  }

  static reconstitute(value: string): ProductMarkdown {
    return new ProductMarkdown({ value });
  }

  get value() {
    return this.props.value;
  }
}
