import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface Coupon {
  code: any;
  userSelection: any;
  products: any;
  users: any;
  type: any;
  productSelection: any;
  value: any;
  startDate: any;
  endDate: any;
}

const CouponSchema = new Schema<Coupon>({
  code: {
    type: String,
    required: true,
  },
  userSelection: {
    type: String,
    enum: ['general', 'selected'],
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  type: {
    type: String,
    enum: ['amount', 'percentage'],
  },
  productSelection: {
    type: String,
    enum: ['general', 'selected'],
  },
  value: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
});

export const CouponModel = mongoose.model<Coupon>('Coupon', CouponSchema);
