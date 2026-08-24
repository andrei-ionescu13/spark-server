import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { DealDoc } from '../model';
import { Deal } from '../deal';
import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../Result';
import { DealMapper } from '../dealMapper';

export interface DealCommandsRepoI {
  save: (deal: Deal) => Promise<void>;
  getDeal: (id: string) => Promise<Result<Deal | null, DomainValidationError>>;
  deleteDeal: (id: string) => Promise<void>;
  deleteMultipleDeals: (ids: string[]) => Promise<void>;
  removeProductFromDeals: any;
}

export class DealCommandsRepo implements DealCommandsRepoI {
  constructor(private dealModel: Model<DealDoc>) {}

  save = async (deal: Deal) => {
    const persistence = DealMapper.toPersistence(deal);

    await this.dealModel.findOneAndUpdate(
      {
        _id: deal._id,
      },
      { $set: persistence },
      { upsert: true },
    );
  };

  getDeal = async (id: string): Promise<Result<Deal | null, DomainValidationError>> => {
    const doc = await this.dealModel.findOne({ _id: new ObjectId(id) }).exec();
    if (!doc) return Result.ok(null);

    const dealOrError = DealMapper.toDomain(doc);
    if (dealOrError.isErr())
      return Result.fail(new DomainValidationError(dealOrError.error.message));

    const deal = dealOrError.value;
    return Result.ok(deal);
  };

  deleteDeal = async (id: string) => {
    await this.dealModel.deleteOne({ _id: id });
  };

  deleteMultipleDeals = async (ids: string[]) => {
    await this.dealModel.deleteMany({ _id: { $in: ids } });
  };

  removeProductFromDeals = (productId) =>
    this.dealModel
      .updateMany(
        { products: productId },
        {
          $pull: {
            products: productId,
          },
        },
        {
          new: true,
        },
      )
      .exec();
}
