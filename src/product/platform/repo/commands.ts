import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Result } from '../../../Result';
import { DomainValidationError } from '../../../blog/article/status';
import { PlatformDoc } from '../model';
import { Platform } from '../platform';
import { PlatformMapper } from '../platformMapper';

export interface PlatformCommandsRepoI {
  save: (platform: Platform) => Promise<void>;
  deletePlatform: (id: string) => Promise<void>;
  getPlatform: (id: string) => Promise<Result<Platform | null, DomainValidationError>>;
}

export class PlatformCommandsRepo implements PlatformCommandsRepoI {
  constructor(private platformModel: Model<PlatformDoc>) {}

  save = async (platform: Platform): Promise<void> => {
    const persistence = PlatformMapper.toPersistance(platform);

    await this.platformModel.updateOne(
      { _id: platform._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getPlatform = async (id: string): Promise<Result<Platform | null, DomainValidationError>> => {
    const doc = await this.platformModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!doc) return Result.ok(null);

    const platformOrError = PlatformMapper.toDomain(doc);
    if (platformOrError.isErr()) {
      return Result.fail(new DomainValidationError(platformOrError.error.message));
    }

    const platform = platformOrError.value;
    return Result.ok(platform);
  };

  deletePlatform = async (id: string) => {
    await this.platformModel.deleteOne({ _id: id });
  };
}
