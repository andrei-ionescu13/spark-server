import * as z from 'zod';
import { DomainValidationError } from '../../../blog/article/domain/status';
import { zodDomainValidationError } from '../../../../zodErrors';
import { LanguageCode } from './languageCode';
import { Result } from '../../../../results';
import { v7 as uuid7 } from 'uuid';

interface LanguageProps {
  name: string;
  code: LanguageCode;
  _id: string;
}

interface CreateLanguageProps extends Omit<LanguageProps, '_id'> {}

export class Language {
  constructor(private props: LanguageProps) {}

  public static create(props: CreateLanguageProps): Result<Language, DomainValidationError> {
    const schema = z.object({
      name: z.string(),
      _id: z.string(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new Language({ ...props, _id: uuid7() }));
  }

  public static reconstitute(props: LanguageProps) {
    return new Language(props);
  }

  get name() {
    return this.props.name;
  }

  get code() {
    return this.props.code;
  }

  get _id() {
    return this.props._id;
  }
}
