import * as z from 'zod';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';
import { DomainValidationError } from './status';
import { ValueObject } from './valueObject';

interface MarkdownProps {
  value: string;
}

export class Markdown extends ValueObject<MarkdownProps> {
  private constructor(props: MarkdownProps) {
    super(props);
  }

  static create(props: MarkdownProps): Result<Markdown, DomainValidationError> {
    const schema = z.string().min(120).max(1024);
    const result = schema.safeParse(props.value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new Markdown(props));
  }

  get value() {
    return this.props.value;
  }
}
