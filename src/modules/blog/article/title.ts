import * as z from 'zod';
import { Result } from '../../../Result';
import { zodDomainValidationError } from '../../../zodErrors';
import { DomainValidationError } from './status';
import { ValueObject } from '../../../valueObject';

interface TitleProps {
  value: string;
}

export class Title extends ValueObject<TitleProps> {
  private constructor(props: TitleProps) {
    super(props);
  }

  static create(props: TitleProps): Result<Title, DomainValidationError> {
    const schema = z.string().min(12).max(120);
    const result = schema.safeParse(props.value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new Title(props));
  }

  public get value() {
    return this.props.value;
  }
}
