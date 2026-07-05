import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface AssetDoc {
  public_id: string;
  width: number;
  height: number;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  created_at: string;
  url: string;
  secure_url: string;
  original_filename: string;
  format: string;

  // version: number;
  // signature: string;
  // tags: Array<string>;
  // pages: number;
  // bytes: number;
  // type: string;
  // etag: string;
  // placeholder: boolean;
  // access_mode: string;
  // moderation: Array<string>;
  // access_control: Array<string>;
  // context: object;
  // metadata: object;
  // colors?: [string, number][];
}

export const AssetSchema = new Schema({
  public_id: String,
  width: Number,
  height: Number,
  resource_type: String,
  created_at: Date,
  url: String,
  secure_url: String,
  original_filename: String,
  format: String,

  // asset_id: String,
  // version: Number,
  // version_id: String,
  // signature: String,
  // tags: [String],
  // bytes: Number,
  // type: String,
  // etag: String,
  // placeholder: Boolean,
  // api_key: String,
});
