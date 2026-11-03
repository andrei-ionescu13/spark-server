import { DomainValidationError } from '../../blog/article/domain/status';
import { Result } from '../../../result';
import { Discount } from '../domain/discount';
import { DiscountMapper } from '../discountMapper';
import { DiscountDoc } from '../model';
import { Collection } from 'mongodb';

export interface DiscountCommandsRepoI {
  save: (discount: Discount) => Promise<void>;
  deleteDiscount: (id: string) => Promise<void>;
  getDiscount: (id: string) => Promise<Discount | null>;
}

export class DiscountCommandsRepo implements DiscountCommandsRepoI {
  constructor(private collection: Collection<DiscountDoc>) {}

  getDiscount = async (id: string): Promise<Discount | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const discount = DiscountMapper.toDomain(doc);
    return discount;
  };

  deleteDiscount = async (id: string): Promise<void> => {
    await this.collection.deleteOne({ _id: id });
  };

  save = async (discount: Discount): Promise<void> => {
    const persistence = DiscountMapper.toPersistance(discount);
    await this.collection.updateOne({ _id: discount._id }, { $set: persistence }, { upsert: true });
  };
}
