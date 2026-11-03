import { AssetDoc } from '../../../Asset';

export interface DeveloperDoc {
  name: string;
  logo: AssetDoc;
  createdAt: Date;
  updatedAt: Date | null;
  _id: string;
  slug: string;
}
