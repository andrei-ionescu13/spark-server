import { Collection, ObjectId } from 'mongodb';
import { DomainValidationError } from '../../../blog/article/domain/status';
import { OperatingSystemDoc } from '../model';
import { OperatingSystem } from '../domain/operatingSystem';
import { OperatingSystemMapper } from '../operatingSystemMapper';

export interface OperatingSystemCommandsRepoI {
  save: (operatingSystem: OperatingSystem) => Promise<void>;
  deleteOperatingSystem: (id: string) => Promise<void>;
  getOperatingSystem: (id: string) => Promise<OperatingSystem | null>;
}

export class OperatingSystemCommandsRepo implements OperatingSystemCommandsRepoI {
  constructor(private collection: Collection<OperatingSystemDoc>) {}

  save = async (operatingSystem: OperatingSystem): Promise<void> => {
    const persistence = OperatingSystemMapper.toPersistance(operatingSystem);
    await this.collection.updateOne(
      { _id: operatingSystem._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getOperatingSystem = async (id: string): Promise<OperatingSystem | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const operatingSystem = OperatingSystemMapper.toDomain(doc);
    return operatingSystem;
  };

  deleteOperatingSystem = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}
