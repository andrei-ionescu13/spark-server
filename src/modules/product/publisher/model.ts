import { AssetDoc } from '../../../asset';

export interface PublisherDoc {
  name: string;
  logo: AssetDoc;
  createdAt: Date;
  updatedAt: Date | null;
  _id: string;
  slug: string;
}
