import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Result } from '../../../Result';
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
  constructor(private publisherModel: Model<PublisherDoc>) {}

  save = async (publisher: Publisher): Promise<void> => {
    const persistence = PublisherMapper.toPersistance(publisher);

    await this.publisherModel.updateOne(
      { _id: publisher._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getPublisher = async (id: string): Promise<Result<Publisher | null, DomainValidationError>> => {
    const doc = await this.publisherModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!doc) return Result.ok(null);

    const publisherOrError = PublisherMapper.toDomain(doc);
    if (publisherOrError.isErr()) {
      return Result.fail(new DomainValidationError(publisherOrError.error.message));
    }

    const publisher = publisherOrError.value;
    return Result.ok(publisher);
  };

  deletePublisher = async (id: string) => {
    await this.publisherModel.deleteOne({ _id: id });
  };
}
