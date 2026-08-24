import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/status';
import { ValueObject } from '../../valueObject';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';

interface LanguageCodeProps {
  value: string;
}

export class LanguageCode extends ValueObject<LanguageCodeProps> {
  private constructor(props: LanguageCodeProps) {
    super(props);
  }

  static create(code: string): Result<LanguageCode, DomainValidationError> {
    const schema = z.string().min(2).max(2);
    const result = schema.safeParse(code);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new LanguageCode({ value: code }));
  }

  get value() {
    return this.props.value;
  }
}
