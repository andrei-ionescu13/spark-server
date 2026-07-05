import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface DiscountDoc {
  title: string;
  products: string[];
  type: 'amount' | 'percentage';
  value: number;
  startDate: Date;
  endDate: Date | null;
  _id: string;
}

const DiscountSchema = new Schema<DiscountDoc>({
  _id: {
    type: String,
    required: true,
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
