import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface CouponDoc {
  _id: string;
  code: string;
  userSelection: 'general' | 'selected';
  type: 'amount' | 'percentage';
  productSelection: 'general' | 'selected';
  products: string[];
  users: string[];
  value: number;
  startDate: Date;
  endDate: Date;
}

const CouponSchema = new Schema<CouponDoc>({
  _id: {
    type: String,
    required: true,
  },
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

export const CouponModel = mongoose.model<CouponDoc>('Coupon', CouponSchema);
