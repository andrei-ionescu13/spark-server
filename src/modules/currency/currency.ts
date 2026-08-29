import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';

interface CurrencyProps {
  name: string;
  code: string;
  symbol: string;
  _id: string;
}

export class Currency {
  constructor(private props: CurrencyProps) {}

  public static create(props: CurrencyProps): Result<Currency, DomainValidationError> {
    const schema = z.object({
      name: z.string(),
      code: z.string(),
      symbol: z.string(),
      _id: z.string(),
    });

    const result = schema.safeParse(props.name);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new Currency(props));
  }

  get name() {
    return this.props.name;
  }

  get code() {
    return this.props.code;
  }

  get symbol() {
    return this.props.symbol;
  }

  get _id() {
    return this.props._id;
  }
}
