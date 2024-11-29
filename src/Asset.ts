import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface Asset {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  created_at: string;
  tags: Array<string>;
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
  moderation: Array<string>;
  access_control: Array<string>;
  context: object;
  metadata: object;
  colors?: [string, number][];
}

export const AssetSchema = new Schema({
  asset_id: String,
  public_id: String,
  version: Number,
  version_id: String,
  signature: String,
  width: Number,
  height: Number,
  format: String,
  resource_type: String,
  created_at: Date,
  tags: [String],
  bytes: Number,
  type: String,
  etag: String,
  placeholder: Boolean,
  url: String,
  secure_url: String,
  original_filename: String,
  api_key: String,
});
