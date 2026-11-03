export interface UpdateCouponRequestDto {
  couponId: string;
  code: string;
  endDate: Date | null;
  productSelection: 'general' | 'selected';
  products: string[] | null;
  startDate: Date;
  type: 'amount' | 'percentage';
  userSelection: 'general' | 'selected';
  users: string[] | null;
  value: number;
}
