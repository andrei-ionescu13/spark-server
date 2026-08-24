import * as z from 'zod';
import { zodError } from '../blog/article/status';
import { ValueObject } from '../valueObject';
import { Result } from '../Result';

export class Type extends ValueObject<{ value: string }> {
  constructor(props: { value: string }) {
    super(props);
  }

  static create(value: string): Result<Type, Error> {
    const schema = z.enum(['amount', 'percentage']);
    const validation = schema.safeParse(value);

    if (validation.error) return Result.fail(zodError(validation.error));

    return Result.ok(new Type({ value }));
  }
}
