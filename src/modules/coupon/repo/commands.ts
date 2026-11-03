import { Collection } from 'mongodb';
import { Result } from '../../../result';
import { DomainValidationError } from '../../blog/article/domain/status';
import { Coupon } from '../domain/coupon';
import { CouponMapper } from '../couponMapper';
import { CouponDoc } from '../model';

export interface CouponCommandsRepoI {
  save: (coupon: Coupon) => Promise<void>;
  getCoupon: (id: string) => Promise<Coupon | null>;
  deleteCoupon: (id: string) => Promise<void>;
}

export class CouponCommandsRepo implements CouponCommandsRepoI {
  constructor(private collection: Collection<CouponDoc>) {}

  save = async (coupon: Coupon) => {
    const persistence = CouponMapper.toPersistance(coupon);
    await this.collection.updateOne({ _id: coupon._id }, { $set: persistence }, { upsert: true });
  };

  getCoupon = async (id: string): Promise<Coupon | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const coupon = CouponMapper.toDomain(doc);
    return coupon;
  };

  deleteCoupon = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}
