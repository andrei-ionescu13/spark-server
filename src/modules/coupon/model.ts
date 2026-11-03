export interface CouponDoc {
  _id: string;
  code: string;
  userSelection: 'general' | 'selected';
  type: 'amount' | 'percentage';
  productSelection: 'general' | 'selected';
  products: string[] | null;
  users: string[] | null;
  value: number;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}
