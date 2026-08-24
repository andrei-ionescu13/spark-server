import mongoose from 'mongoose';
const { Schema } = mongoose;

type Status = 'open' | 'archived' | 'canceled';
type PaymentStatus = 'authorized' | 'paid' | 'pending' | 'refunded' | 'expired';
type FulfillmentStatus = 'fulfilled' | 'unfulfilled' | 'partially fulfilled';

export interface OrderDoc {
  _id: string;
  status: Status;
  orderNumber: string;
  email: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  customer: string;
  createdAt: Date;
  itemCount: number;
  totalPrice: number;
  totalDiscounts: number;
  lineItems: LineItemDoc[];
}

export interface LineItemDoc {
  _id: string;
  product: string;
  finalLinePrice: number;
  finalPrice: number;
  originalPrice: number;
  originalLinePrice: number;
  quantity: number;
}

const LineItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'product' },
  finalLinePrice: { type: Number },
  finalPrice: { type: Number },
  originalPrice: { type: Number },
  originalLinePrice: { type: Number },
  quantity: { type: Number },
});

const OrderSchema = new Schema<OrderDoc>({
  _id: {
    type: String,
    unique: true,
  },
  status: {
    type: String,
    enum: ['open', 'archived', 'canceled'],
    default: 'open',
  },
  orderNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ['authorized', 'paid', 'pending', 'refunded', 'expired'],
    default: 'pending',
  },
  fulfillmentStatus: {
    type: String,
    enum: ['fulfilled', 'unfulfilled', 'partially fulfilled'],
    default: 'unfulfilled',
  },
  customer: { type: String, ref: 'User' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  itemCount: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
  totalDiscounts: {
    type: Number,
  },
  lineItems: [LineItemSchema],
});

export const OrderModel = mongoose.model<OrderDoc>('Order', OrderSchema);
