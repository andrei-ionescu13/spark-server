import * as z from 'zod';
import { ValueObject } from '../blog/article/valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

export class Code extends ValueObject<{ value: string }> {
  constructor(props: { value: string }) {
    super(props);
  }

  static create(value: string): Result<Code, Error> {
    const schema = z.string().min(3);
    const validation = schema.safeParse(value);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new Code({ value: value.toUpperCase() }));
  }
}
