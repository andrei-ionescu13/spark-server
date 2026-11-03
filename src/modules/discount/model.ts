import { Product } from '../product/domain/product';
import { ProductDoc } from '../product/model';

export interface DiscountDoc {
  title: string;
  product: string;
  type: 'amount' | 'percentage';
  value: number;
  startDate: Date;
  endDate: Date | null;
  _id: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface DiscountPopulatedDoc extends Omit<DiscountDoc, 'product'> {
  product: ProductDoc;
}
