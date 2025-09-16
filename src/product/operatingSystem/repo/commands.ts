import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Result } from '../../../Result';
import { DomainValidationError } from '../../../blog/article/status';
import { OperatingSystemDoc } from '../model';
import { OperatingSystem } from '../operatingSystem';
import { OperatingSystemMapper } from '../operatingSystemMapper';

export interface OperatingSystemCommandsRepoI {
  save: (operatingSystem: OperatingSystem) => Promise<void>;
  deleteOperatingSystem: (id: string) => Promise<void>;
  getOperatingSystem: (
    id: string,
  ) => Promise<Result<OperatingSystem | null, DomainValidationError>>;
}

export class OperatingSystemCommandsRepo implements OperatingSystemCommandsRepoI {
  constructor(private operatingSystemModel: Model<OperatingSystemDoc>) {}

  save = async (operatingSystem: OperatingSystem): Promise<void> => {
    const persistence = OperatingSystemMapper.toPersistance(operatingSystem);

    await this.operatingSystemModel.updateOne(
      { _id: operatingSystem._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getOperatingSystem = async (
    id: string,
  ): Promise<Result<OperatingSystem | null, DomainValidationError>> => {
    const doc = await this.operatingSystemModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!doc) return Result.ok(null);

    const operatingSystemOrError = OperatingSystemMapper.toDomain(doc);
    if (operatingSystemOrError.isErr()) {
      return Result.fail(new DomainValidationError(operatingSystemOrError.error.message));
    }

    const operatingSystem = operatingSystemOrError.value;
    return Result.ok(operatingSystem);
  };

  deleteOperatingSystem = async (id: string) => {
    await this.operatingSystemModel.deleteOne({ _id: id });
  };
}
