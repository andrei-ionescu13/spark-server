import { Collection } from 'mongodb';
import { Result } from '../../../../Result';
import { DomainValidationError } from '../../../blog/article/status';
import { PublisherDoc } from '../model';
import { Publisher } from '../publisher';
import { PublisherMapper } from '../publisherMapper';

export interface PublisherCommandsRepoI {
  save: (publisher: Publisher) => Promise<void>;
  deletePublisher: (id: string) => Promise<void>;
  getPublisher: (id: string) => Promise<Result<Publisher | null, DomainValidationError>>;
}

export class PublisherCommandsRepo implements PublisherCommandsRepoI {
  constructor(private collection: Collection<PublisherDoc>) {}

  save = async (publisher: Publisher): Promise<void> => {
    const persistence = PublisherMapper.toPersistance(publisher);

    await this.collection.updateOne(
      { _id: publisher._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getPublisher = async (id: string): Promise<Result<Publisher | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return Result.ok(null);

    const publisherOrError = PublisherMapper.toDomain(doc);
    if (publisherOrError.isErr()) {
      return Result.fail(new DomainValidationError(publisherOrError.error.message));
    }

    const publisher = publisherOrError.value;
    return Result.ok(publisher);
  };

  deletePublisher = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}
