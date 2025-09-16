import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface UserDoc {
  email: string;
  password: string;
  createdAt: Date;
  status: 'active' | 'inactive' | 'banned';
  updatedAt: Date;
  orders: string[];
  activeOrders: string[];
  ordersCount: number;
  totalSpend: number;
  reviews: string[];
  coupons: string[];
  _id: string;
}

const UserSchema = new Schema<UserDoc>({
  _id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'inactive',
  },
  updatedAt: {
    type: Date,
  },
  orders: [
    {
      type: String,
      ref: 'Order',
    },
  ],
  activeOrders: [
    {
      type: String,
      ref: 'Order',
    },
  ],
  ordersCount: {
    type: Number,
    default: 0,
  },
  totalSpend: {
    type: Number,
    default: 0,
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review', default: [] }],
  coupons: [{ type: Schema.Types.ObjectId, ref: 'PromoCode', default: [] }],
});

export const UserModel = mongoose.model<UserDoc>('User', UserSchema);
