export interface CreateCouponRequestDto {
  code: string;
  endDate: Date | null;
  products: string[] | null;
  startDate: Date;
  type: 'amount' | 'percentage';
  productSelection: 'general' | 'selected';
  userSelection: 'general' | 'selected';
  users: string[] | null;
  value: number;
}
