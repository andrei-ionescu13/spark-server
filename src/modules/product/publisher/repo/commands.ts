import { Collection } from 'mongodb';
import { Result } from '../../../../result';
import { DomainValidationError } from '../../../blog/article/domain/status';
import { PublisherDoc } from '../model';
import { Publisher } from '../domain/publisher';
import { PublisherMapper } from '../publisherMapper';

export interface PublisherCommandsRepoI {
  save: (publisher: Publisher) => Promise<void>;
  deletePublisher: (id: string) => Promise<void>;
  getPublisher: (id: string) => Promise<Publisher | null>;
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

  getPublisher = async (id: string): Promise<Publisher | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const publisher = PublisherMapper.toDomain(doc);
    return publisher;
  };

  deletePublisher = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}
