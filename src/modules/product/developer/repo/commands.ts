import { Collection, ObjectId } from 'mongodb';
import { Result } from '../../../../Result';
import { DomainValidationError } from '../../../blog/article/status';
import { Developer } from '../developer';
import { DeveloperMapper } from '../developerMapper';
import { DeveloperDoc } from '../model';

export interface DeveloperCommandsRepoI {
  save: (developer: Developer) => Promise<void>;
  deleteDeveloper: (id: string) => Promise<void>;
  getDeveloper: (id: string) => Promise<Result<Developer | null, DomainValidationError>>;
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

  getDeveloper = async (id: string): Promise<Result<Developer | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return Result.ok(null);

    const developerOrError = DeveloperMapper.toDomain(doc);
    if (developerOrError.isErr()) {
      return Result.fail(new DomainValidationError(developerOrError.error.message));
    }

    const developer = developerOrError.value;
    return Result.ok(developer);
  };

  deleteDeveloper = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}
