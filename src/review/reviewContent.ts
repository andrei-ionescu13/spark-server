import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

export class ReviewContent extends ValueObject<{ value: string }> {
  constructor(props: { value: string }) {
    super(props);
  }

  static create(content: string): Result<ReviewContent, DomainValidationError> {
    const schema = z.string().max(255);
    const validation = schema.safeParse(content);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new ReviewContent({ value: content }));
  }

  get value() {
    return this.props.value;
  }
}
