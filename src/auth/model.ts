import { Schema, model } from 'mongoose';
import type { Types } from 'mongoose';

export interface Admin {
  username: String;
  password: String;
}

export interface Token {
  admin: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  type: string;
}

const adminSchema = new Schema<Admin>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const tokenSchema = new Schema<Token>({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
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

export const AdminModel = model<Admin>('Admin', adminSchema);
export const TokenModel = model<Token>('Token', tokenSchema);
