import { Collection } from 'mongodb';
import { DomainValidationError } from '../../../blog/article/domain/status';
import { PlatformDoc } from '../model';
import { Platform } from '../domain/platform';
import { PlatformMapper } from '../platformMapper';
import { Result } from '../../../../result';

export interface PlatformCommandsRepoI {
  save: (platform: Platform) => Promise<void>;
  deletePlatform: (id: string) => Promise<void>;
  getPlatform: (id: string) => Promise<Platform | null>;
}

export class PlatformCommandsRepo implements PlatformCommandsRepoI {
  constructor(private collection: Collection<PlatformDoc>) {}

  save = async (platform: Platform): Promise<void> => {
    const persistence = PlatformMapper.toPersistance(platform);
    await this.collection.updateOne({ _id: platform._id }, { $set: persistence }, { upsert: true });
  };

  getPlatform = async (id: string): Promise<Platform | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const platform = PlatformMapper.toDomain(doc);
    return platform;
  };

  deletePlatform = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}
