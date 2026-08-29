import { Collection, ObjectId } from 'mongodb';
import { DealDoc } from '../model';
import { Deal } from '../deal';
import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../../Result';
import { DealMapper } from '../dealMapper';

export interface DealCommandsRepoI {
  save: (deal: Deal) => Promise<void>;
  getDeal: (id: string) => Promise<Result<Deal | null, DomainValidationError>>;
  deleteDeal: (id: string) => Promise<void>;
  deleteMultipleDeals: (ids: string[]) => Promise<void>;
}

export class DealCommandsRepo implements DealCommandsRepoI {
  constructor(private collections: Collection<DealDoc>) {}

  save = async (deal: Deal) => {
    const persistence = DealMapper.toPersistence(deal);

    await this.collections.findOneAndUpdate(
      {
        _id: deal._id,
      },
      { $set: persistence },
      { upsert: true },
    );
  };

  getDeal = async (id: string): Promise<Result<Deal | null, DomainValidationError>> => {
    const doc = await this.collections.findOne({ _id: id });
    if (!doc) return Result.ok(null);

    const dealOrError = DealMapper.toDomain(doc);
    if (dealOrError.isErr())
      return Result.fail(new DomainValidationError(dealOrError.error.message));

    const deal = dealOrError.value;
    return Result.ok(deal);
  };

  deleteDeal = async (id: string) => {
    await this.collections.deleteOne({ _id: id });
  };

  deleteMultipleDeals = async (ids: string[]) => {
    await this.collections.deleteMany({ _id: { $in: ids } });
  };
}
