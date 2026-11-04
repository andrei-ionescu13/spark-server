import * as z from 'zod';
import { zodDomainValidationError } from '../../../../zodErrors';
import { DomainValidationError } from './status';
import { ValueObject } from '../../../../valueObject';
import { Result } from '../../../../results';

interface TitleProps {
  value: string;
}

export class ArticleTitle extends ValueObject<TitleProps> {
  private constructor(props: TitleProps) {
    super(props);
  }

  public static create(title: string): Result<ArticleTitle, DomainValidationError> {
    const schema = z.string().min(1).max(120);
    const result = schema.safeParse(title);

    if (result.error) {
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new ArticleTitle({ value: title }));
  }

  public static reconstitute(title: string) {
    return new ArticleTitle({ value: title });
  }

  public get value() {
    return this.props.value;
  }
}
