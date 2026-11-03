import { Collection, ObjectId } from 'mongodb';
import { Result } from '../../../../result';
import { DomainValidationError } from '../../../blog/article/domain/status';
import { Developer } from '../domain/developer';
import { DeveloperMapper } from '../developerMapper';
import { DeveloperDoc } from '../model';

export interface DeveloperCommandsRepoI {
  save: (developer: Developer) => Promise<void>;
  deleteDeveloper: (id: string) => Promise<void>;
  getDeveloper: (id: string) => Promise<Developer | null>;
}

export class DeveloperCommandsRepo implements DeveloperCommandsRepoI {
  constructor(private collection: Collection<DeveloperDoc>) {}

  save = async (developer: Developer): Promise<void> => {
    const persistence = DeveloperMapper.toPersistance(developer);

    await this.collection.updateOne(
      { _id: developer._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getDeveloper = async (id: string): Promise<Developer | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const developer = DeveloperMapper.toDomain(doc);
    return developer;
  };

  deleteDeveloper = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}
