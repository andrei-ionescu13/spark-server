import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

export class ReviewRating extends ValueObject<{ value: number }> {
  constructor(props: { value: number }) {
    super(props);
  }

  static create(rating: number): Result<ReviewRating, DomainValidationError> {
    const schema = z.number().min(1).max(5).int();
    const validation = schema.safeParse(rating);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new ReviewRating({ value: rating }));
  }

  get value() {
    return this.props.value;
  }
}
