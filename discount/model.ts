import mongoose from 'mongoose';
const { Schema } = mongoose;

type DiscountDocType = 'amount' | 'percentage';

export interface DiscountDoc {
  title: string;
  products: string[];
  type: DiscountDocType;
  value: number;
  startDate: Date;
  endDate: Date;
  _id: string;
}

const DiscountSchema = new Schema<DiscountDoc>({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  type: {
    type: String,
    enum: ['amount', 'percentage'],
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

export const DiscountModel = mongoose.model<DiscountDoc>('Discount', DiscountSchema);
