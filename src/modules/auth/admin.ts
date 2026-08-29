import * as z from 'zod';
import { zodDomainValidationError } from '../../zodErrors';
import { AdminUsername } from './adminUsername';
import { DomainValidationError } from '../blog/article/status';
import { Result } from '../../result';
import { v7 as uuid7 } from 'uuid';

interface AdminProps {
  _id: string;
  username: AdminUsername;
  passwordHash: string;
}

interface CreateAdminProps extends Omit<AdminProps, '_id'> {}

export class Admin {
  constructor(private readonly props: AdminProps) {}

  static create(props: CreateAdminProps): Result<Admin, DomainValidationError> {
    const schema = z.object({
      passwordHash: z.string(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new Admin({ ...props, _id: uuid7() }));
  }

  public static reconstitute(props: AdminProps) {
    return new Admin(props);
  }

  get _id() {
    return this.props._id;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  get username() {
    return this.props.username;
  }
}
