import { Schema, model } from 'mongoose';

export interface AdminDoc {
  username: string;
  _id: string;
  passwordHash: string;
}

export interface TokenDoc {
  _id: string;
  admin: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  type: 'refresh-token';
}

const adminSchema = new Schema<AdminDoc>({
  _id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

const tokenSchema = new Schema<TokenDoc>({
  _id: {
    type: String,
    required: true,
  },
  admin: {
    type: String,
    ref: 'Admin',
    required: true,
  },
  value: {
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
