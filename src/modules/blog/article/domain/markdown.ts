import * as z from 'zod';
import { zodDomainValidationError } from '../../../../zodErrors';
import { DomainValidationError } from './status';
import { ValueObject } from '../../../../valueObject';
import { Result } from '../../../../results';

interface MarkdownProps {
  value: string;
}

export class ArticleMarkdown extends ValueObject<MarkdownProps> {
  private constructor(props: MarkdownProps) {
    super(props);
  }

  static create(markdown: string): Result<ArticleMarkdown, DomainValidationError> {
    const schema = z.string().min(1).max(1024);
    const result = schema.safeParse(markdown);

    if (result.error) {
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new ArticleMarkdown({ value: markdown }));
  }

  public static reconstitute(markdown: string) {
    return new ArticleMarkdown({ value: markdown });
  }

  get value() {
    return this.props.value;
  }
}
