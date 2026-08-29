import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../../Result';
import { zodDomainValidationError } from '../../../zodErrors';
import { LanguageCode } from './languageCode';

interface LanguageProps {
  name: string;
  code: LanguageCode;
  nativeName: string;
  _id: string;
}

export class Language {
  constructor(private props: LanguageProps) {}

  public static create(props: LanguageProps): Result<Language, DomainValidationError> {
    const schema = z.object({
      name: z.string(),
      nativeName: z.string(),
      _id: z.string(),
    });

    const result = schema.safeParse(props.name);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new Language(props));
  }

  get name() {
    return this.props.name;
  }

  get code() {
    return this.props.code;
  }

  get nativeName() {
    return this.props.nativeName;
  }

  get _id() {
    return this.props._id;
  }
}
