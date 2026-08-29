export interface CouponDoc {
  _id: string;
  code: string;
  userSelection: 'general' | 'selected';
  type: 'amount' | 'percentage';
  productSelection: 'general' | 'selected';
  products: string[];
  users: string[];
  value: number;
  startDate: Date;
  endDate: Date | null;
}
