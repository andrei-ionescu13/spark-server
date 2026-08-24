import { Model } from 'mongoose';
import { DomainValidationError } from '../../../blog/article/status';
import { Result } from '../../../Result';
import { Admin } from '../../admin';
import { AdminDoc } from '../../model';
import { AdminMapper } from '../../adminMapper';

export interface AdminCommandsRepoI {
  save: (admin: Admin) => Promise<void>;
  getAdminByUsername: (username: string) => Promise<Result<Admin | null, DomainValidationError>>;
  getAdmin: (id: string) => Promise<Result<Admin | null, DomainValidationError>>;
}

export class AdminCommandsRepo implements AdminCommandsRepoI {
  constructor(private adminModel: Model<AdminDoc>) {}

  save = async (admin: Admin) => {
    const persistence = AdminMapper.toPersistence(admin);

    await this.adminModel.findOneAndUpdate(
      {
        _id: admin.id,
      },
      { $set: persistence },
      { upsert: true },
    );
  };

  getAdminByUsername = async (
    username: string,
  ): Promise<Result<Admin | null, DomainValidationError>> => {
    const doc = await this.adminModel.findOne({ username }).lean();
    if (!doc) return Result.ok(null);

    const adminOrError = AdminMapper.toDomain(doc);
    if (adminOrError.isErr())
      return Result.fail(new DomainValidationError(adminOrError.error.message));

    const admin = adminOrError.value;
    return Result.ok(admin);
  };

  getAdmin = async (id: string): Promise<Result<Admin | null, DomainValidationError>> => {
    const doc = await this.adminModel.findOne({ _id: id }).lean();
    if (!doc) return Result.ok(null);

    const adminOrError = AdminMapper.toDomain(doc);
    if (adminOrError.isErr())
      return Result.fail(new DomainValidationError(adminOrError.error.message));

    const admin = adminOrError.value;
    return Result.ok(admin);
  };
}
