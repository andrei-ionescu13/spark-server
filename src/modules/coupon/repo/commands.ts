import { Collection } from 'mongodb';
import { Result } from '../../../Result';
import { DomainValidationError } from '../../blog/article/status';
import { Coupon } from '../coupon';
import { CouponMapper } from '../couponMapper';
import { CouponDoc } from '../model';

export interface CouponCommandsRepoI {
  save: (coupon: Coupon) => Promise<void>;
  getCoupon: (id: string) => Promise<Result<Coupon | null, DomainValidationError>>;
  deleteCoupon: (id: string) => Promise<void>;
}

export class CouponCommandsRepo implements CouponCommandsRepoI {
  constructor(private collection: Collection<CouponDoc>) {}

  save = async (coupon: Coupon) => {
    const persistence = CouponMapper.toPersistance(coupon);
    await this.collection.updateOne({ _id: coupon._id }, { $set: persistence }, { upsert: true });
  };

  getCoupon = async (id: string): Promise<Result<Coupon | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return Result.ok(null);

    const couponOrError = CouponMapper.toDomain(doc);

    if (couponOrError.isErr()) {
      return Result.fail(new DomainValidationError(couponOrError.error.message));
    }
    const coupon = couponOrError.value;

    return Result.ok(coupon);
  };

  deleteCoupon = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}
