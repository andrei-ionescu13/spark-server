import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface Order {
  status: any;
  orderNumber: any;
  email: any;
  paymentStatus: any;
  fulfillmentStatus: any;
  customer: any;
  createdAt: any;
  itemCount: any;
  totalPrice: any;
  totalDiscounts: any;
  lineItems: any;
}

const LineItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'product' },
  finalLinePrice: { type: Number },
  finalPrice: { type: Number },
  originalPrice: { type: Number },
  originalLinePrice: { type: Number },
  quantity: { type: Number },
});

const OrderSchema = new Schema<Order>({
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
  customer: { type: Schema.Types.ObjectId, ref: 'User' },
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

export const OrderModel = mongoose.model<Order>('Order', OrderSchema);
