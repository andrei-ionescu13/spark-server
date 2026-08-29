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
