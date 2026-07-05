import * as z from 'zod';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

interface AdminProps {
  _id: string;
  username: string;
  password: string;
}

export class Admin {
  constructor(private readonly props: AdminProps) {}

  create(props: AdminProps) {
    const schema = z.object({
      username: z.string(),
      password: z.string(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new Admin(props));
  }

  get id() {
    return this.props._id;
  }

  get password() {
    return this.props.password;
  }
}
