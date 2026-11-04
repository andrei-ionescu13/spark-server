import { AssetDoc } from '../../asset';
import { MetaDoc } from '../../meta';
import { ProductDoc } from '../product/model';

export interface CollectionDoc {
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

export interface CollectionPopulatedDoc extends Omit<CollectionDoc, 'products'> {
  products: ProductDoc[];
}
