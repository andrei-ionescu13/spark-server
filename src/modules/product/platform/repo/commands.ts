import { Collection } from 'mongodb';
import { Result } from '../../../../Result';
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
  constructor(private collection: Collection<PlatformDoc>) {}

  save = async (platform: Platform): Promise<void> => {
    const persistence = PlatformMapper.toPersistance(platform);

    await this.collection.updateOne({ _id: platform._id }, { $set: persistence }, { upsert: true });
  };

  getPlatform = async (id: string): Promise<Result<Platform | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return Result.ok(null);

    const platformOrError = PlatformMapper.toDomain(doc);
    if (platformOrError.isErr()) {
      return Result.fail(new DomainValidationError(platformOrError.error.message));
    }

    const platform = platformOrError.value;
    return Result.ok(platform);
  };

  deletePlatform = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}
