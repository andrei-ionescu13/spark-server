import { Model } from 'mongoose';
import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../Result';
import { Discount } from '../discount';
import { DiscountMapper } from '../discountMapper';
import { DiscountDoc } from '../model';

export interface DiscountCommandsRepoI {
  save: (discount: Discount) => Promise<void>;
  deleteDiscount: (id: string) => Promise<void>;
  getDiscount: (id: string) => Promise<Result<Discount | null, DomainValidationError>>;
}

export class DiscountCommandsRepo implements DiscountCommandsRepoI {
  constructor(private discountModel: Model<DiscountDoc>) {}

  getDiscount = async (id: string): Promise<Result<Discount | null, DomainValidationError>> => {
    const doc = await this.discountModel.findOne({ _id: id }).lean();
    if (!doc) return Result.ok(null);

    const discountOrError = DiscountMapper.toDomain(doc);
    if (discountOrError.isErr()) {
      return Result.fail(new DomainValidationError(discountOrError.error.message));
    }

    const discount = discountOrError.value;
    return Result.ok(discount);
  };

  deleteDiscount = async (id: string): Promise<void> => {
    await this.discountModel.deleteOne({ _id: id });
  };

  save = async (discount: Discount): Promise<void> => {
    const persistence = DiscountMapper.toPersistance(discount);

    await this.discountModel.updateOne(
      { _id: discount._id },
      { $set: persistence },
      { upsert: true },
    );
  };
}
