import { Model } from 'mongoose';
import { Result } from '../../Result';
import { DomainValidationError } from '../../blog/article/status';
import { Coupon } from '../coupon';
import { CouponMapper } from '../couponMapper';
import { CouponDoc } from '../model';

export interface CouponCommandsRepoI {
  save: (coupon: Coupon) => Promise<void>;
  getCoupon: (id: string) => Promise<Result<Coupon | null, DomainValidationError>>;
  deleteCoupon: (id: string) => Promise<void>;
  // deleteMultipleCoupons: any;
  // updateCoupon: any;
  // getCouponsCount: any;
  removeProductFromCoupons: any;
}

export class CouponCommandsRepo implements CouponCommandsRepoI {
  constructor(private couponModel: Model<CouponDoc>) {}

  save = async (coupon: Coupon) => {
    const persistence = CouponMapper.toPersistance(coupon);
    await this.couponModel.updateOne({ _id: coupon._id }, { $set: persistence }, { upsert: true });
  };

  getCoupon = async (id: string): Promise<Result<Coupon | null, DomainValidationError>> => {
    const doc = await this.couponModel.findOne({ _id: id }).lean();
    if (!doc) return Result.ok(null);

    const couponOrError = CouponMapper.toDomain(doc);

    if (couponOrError.isErr()) {
      return Result.fail(new DomainValidationError(couponOrError.error.message));
    }
    const coupon = couponOrError.value;

    return Result.ok(coupon);
  };

  deleteCoupon = async (id: string) => {
    await this.couponModel.deleteOne({ _id: id });
  };

  removeProductFromCoupons = (productId) =>
    this.couponModel
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
