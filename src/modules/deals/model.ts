import { AssetDoc } from '../../assets';
import { MetaDoc } from '../../metas';

export interface DealDoc {
  cover: AssetDoc;
  title: string;
  description: string;
  slug: string;
  startDate: Date;
  endDate: Date | null;
  meta: MetaDoc;
  createdAt: Date;
  updatedAt: Date | null;
  products: string[];
  _id: string;
}
