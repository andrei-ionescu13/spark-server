import * as z from 'zod';
import { Result } from '../../../../result';
import { ValueObject } from '../../../../valueObject';
import { zodDomainValidationError } from '../../../../zodErrors';
import { DomainValidationError } from './status';

interface DescriptionProps {
  value: string;
}

export class ArticleDescription extends ValueObject<DescriptionProps> {
  private constructor(props: DescriptionProps) {
    super(props);
  }

  static create(description: string): Result<ArticleDescription, DomainValidationError> {
    const schema = z.string().min(1).max(120);
    const result = schema.safeParse(description);

    if (result.error) {
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new ArticleDescription({ value: description }));
  }

  public static reconstitute(description: string) {
    return new ArticleDescription({ value: description });
  }

  get value() {
    return this.props.value;
  }
}
