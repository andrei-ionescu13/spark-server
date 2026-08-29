import { DomainValidationError } from '../../../blog/article/status';
import { Admin } from '../../admin';
import { AdminDoc } from '../../model';
import { AdminMapper } from '../../adminMapper';
import { Collection } from 'mongodb';
import { Result } from '../../../../Result';

export interface AdminCommandsRepoI {
  save: (admin: Admin) => Promise<void>;
  getAdminByUsername: (username: string) => Promise<Result<Admin | null, DomainValidationError>>;
  getAdmin: (id: string) => Promise<Result<Admin | null, DomainValidationError>>;
}

export class AdminCommandsRepo implements AdminCommandsRepoI {
  constructor(private collection: Collection<AdminDoc>) {}

  save = async (admin: Admin) => {
    const persistence = AdminMapper.toPersistence(admin);
    const { _id, ...props } = persistence;

    await this.collection.findOneAndUpdate(
      {
        _id,
      },
      {
        $set: props,
        $setOnInsert: {
          _id,
        },
      },
      { upsert: true },
    );
  };

  getAdminByUsername = async (
    username: string,
  ): Promise<Result<Admin | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ username });
    if (!doc) return Result.ok(null);

    const adminOrError = AdminMapper.toDomain(doc);
    if (adminOrError.isErr())
      return Result.fail(new DomainValidationError(adminOrError.error.message));

    const admin = adminOrError.value;
    return Result.ok(admin);
  };

  getAdmin = async (id: string): Promise<Result<Admin | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return Result.ok(null);

    const adminOrError = AdminMapper.toDomain(doc);
    if (adminOrError.isErr())
      return Result.fail(new DomainValidationError(adminOrError.error.message));

    const admin = adminOrError.value;
    return Result.ok(admin);
  };
}
