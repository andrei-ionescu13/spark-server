import { Collection, ObjectId } from 'mongodb';
import { DealDoc } from '../model';
import { Deal } from '../domain/deal';
import { DomainValidationError } from '../../blog/article/domain/status';
import { Result } from '../../../result';
import { DealMapper } from '../dealMapper';

export interface DealCommandsRepoI {
  save: (deal: Deal) => Promise<void>;
  getDeal: (id: string) => Promise<Deal | null>;
  deleteDeal: (id: string) => Promise<void>;
  deleteMultipleDeals: (ids: string[]) => Promise<void>;
}

export class DealCommandsRepo implements DealCommandsRepoI {
  constructor(private collection: Collection<DealDoc>) {}

  save = async (deal: Deal) => {
    const persistence = DealMapper.toPersistence(deal);
    console.log(persistence);
    await this.collection.findOneAndUpdate(
      {
        _id: deal._id,
      },
      { $set: persistence },
      { upsert: true },
    );
  };

  getDeal = async (id: string): Promise<Deal | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const deal = DealMapper.toDomain(doc);
    return deal;
  };

  deleteDeal = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };

  deleteMultipleDeals = async (ids: string[]) => {
    await this.collection.deleteMany({ _id: { $in: ids } });
  };
}
