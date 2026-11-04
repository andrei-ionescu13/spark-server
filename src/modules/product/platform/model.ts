import { AssetDoc } from '../../../assets';

export interface PlatformDoc {
  name: string;
  logo: AssetDoc;
  createdAt: Date;
  updatedAt: Date | null;
  _id: string;
  url: string;
}
