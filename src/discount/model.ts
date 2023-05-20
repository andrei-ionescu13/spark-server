import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface Discount {
  title: any;
  products: any;
  type: any;
  value: any;
  startDate: any;
  endDate: any;
}

const DiscountSchema = new Schema<Discount>({
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

export const DiscountModel = mongoose.model<Discount>('Discount', DiscountSchema);
