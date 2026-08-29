import { AssetDoc } from '../../Asset';
import { MetaDoc } from '../../meta';

export interface CollectionDoc {
  cover: AssetDoc;
  title: string;
  description: string | null;
  slug: string;
  startDate: Date;
  endDate: Date;
  meta: MetaDoc;
  createdAt: Date;
  updatedAt: Date | null;
  products: string[];
  isDeal: boolean;
  _id: string;
}
