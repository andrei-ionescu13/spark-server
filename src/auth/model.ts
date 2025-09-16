import { Schema, model } from 'mongoose';

export interface AdminDoc {
  username: string;
  _id: string;
  password: string;
}

export interface TokenDoc {
  _id: string;
  admin: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  type: 'refresh-token';
}

const adminSchema = new Schema<AdminDoc>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const tokenSchema = new Schema<TokenDoc>({
  admin: {
    type: String,
    ref: 'Admin',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: { type: String, enum: ['refresh-token'] },
});

export const AdminModel = model<AdminDoc>('Admin', adminSchema);
export const TokenModel = model<TokenDoc>('Token', tokenSchema);
