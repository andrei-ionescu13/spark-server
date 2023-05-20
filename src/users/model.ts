import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface User {
  email: any;
  password: any;
  createdAt: any;
  status: any;
  previousStatus: any;
  updatedAt: any;
  orders: any;
  activeOrders: any;
  ordersCount: any;
  totalSpend: any;
  reviews: any;
  promoCodes: any;
}

const UserSchema = new Schema<User>({
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
  previousStatus: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
  },
  updatedAt: {
    type: Date,
  },
  orders: {
    type: Array,
    default: [],
  },
  activeOrders: {
    type: Array,
    default: [],
  },
  ordersCount: {
    type: Number,
    default: 0,
  },
  totalSpend: {
    type: Number,
    default: 0,
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review', default: [] }],
  promoCodes: [{ type: Schema.Types.ObjectId, ref: 'PromoCode', default: [] }],
});

export const UserModel = mongoose.model<User>('User', UserSchema);
