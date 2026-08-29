import { AssetDoc } from '../../../Asset';

export interface PlatformDoc {
  name: string;
  logo: AssetDoc;
  createdAt: Date;
  updatedAt: Date | null;
  _id: string;
  slug: string;
  url: string;
}
