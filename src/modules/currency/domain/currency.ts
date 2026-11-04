import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { zodDomainValidationError } from '../../../zodErrors';
import { v7 as uuid7 } from 'uuid';
import { Result } from '../../../result';

interface CurrencyProps {
  name: string;
  code: string;
  symbol: string;
  _id: string;
}

interface CreateCurrencyProps extends Omit<CurrencyProps, '_id'> {}

export class Currency {
  constructor(private props: CurrencyProps) {}

  public static create(props: CreateCurrencyProps): Result<Currency, DomainValidationError> {
    const schema = z.object({
      name: z.string(),
      code: z.string(),
      symbol: z.string(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new Currency({ ...props, _id: uuid7() }));
  }

  public static reconstitute(props: CurrencyProps) {
    return new Currency(props);
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
