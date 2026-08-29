import * as z from 'zod';
import { zodDomainValidationError } from '../../zodErrors';
import { Result } from '../../result';

interface TokenProps {
  _id: string;
  admin: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  type: 'refresh-token';
}

export class Token {
  constructor(private readonly props: TokenProps) {}

  static create(props: TokenProps): Result<Token, Error> {
    const schema = z.object({
      _id: z.string(),
      admin: z.string(),
      value: z.string(),
      expiresAt: z.date().refine((date) => date.getTime() > Date.now(), {
        message: 'expiresAt must be in the future',
      }),
      createdAt: z.date(),
      type: z.enum(['refresh-token']),
    });

    const validation = schema.safeParse(props);

    if (validation.error) {
      console.log(validation.error);
      return Result.fail(zodDomainValidationError(validation.error));
    }

    return Result.ok(new Token(props));
  }

  isExpired() {
    return this.props.expiresAt < new Date();
  }

  get _id() {
    return this.props._id;
  }

  get admin() {
    return this.props.admin;
  }

  get value() {
    return this.props.value;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get type() {
    return this.props.type;
  }
}
