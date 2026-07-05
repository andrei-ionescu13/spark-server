import * as z from 'zod';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

interface TokenProps {
  _id: string;
  admin: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  type: 'refresh-token';
}

export class Token {
  constructor(private readonly props: TokenProps) {}

  create(props: TokenProps): Result<Token, Error> {
    const schema = z.object({
      _id: z.string(),
      admin: z.string(),
      token: z.string(),
      expiresAt: z.date().refine((date) => date.getTime() > Date.now(), {
        message: 'expiresAt must be in the future',
      }),
      createdAt: z.date(),
      type: z.enum(['refresh-token']),
    });

    const validation = schema.safeParse(props);

    if (validation.error) {
      return Result.fail(zodDomainValidationError(validation.error));
    }

    return Result.ok(new Token(props));
  }

  get expiresAt() {
    return this.expiresAt;
  }
}
