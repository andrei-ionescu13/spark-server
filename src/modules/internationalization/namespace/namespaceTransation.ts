import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/status';
import { ValueObject } from '../../../valueObject';
import { Result } from '../../../Result';
import { zodDomainValidationError } from '../../../zodErrors';

interface NamespaceTranslationProps {
  key: string;
  [key: string]: string;
}

export class NamespaceTranslation extends ValueObject<NamespaceTranslationProps> {
  constructor(protected readonly props: NamespaceTranslationProps) {
    super(props);
  }

  public static create(
    props: NamespaceTranslationProps,
  ): Result<NamespaceTranslation, DomainValidationError> {
    const schema = z.string();
    const validation = schema.safeParse(props.key);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new NamespaceTranslation(props));
  }

  get key() {
    return this.props.key;
  }

  get translations(): Record<string, string> {
    const { key, ...translations } = this.props;
    return translations;
  }
}
