export interface DiscountDoc {
  title: string;
  products: string[];
  type: 'amount' | 'percentage';
  value: number;
  startDate: Date;
  endDate: Date | null;
  _id: string;
}
