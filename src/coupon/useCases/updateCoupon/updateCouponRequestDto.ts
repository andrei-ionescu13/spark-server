export interface UpdateCouponRequestDto {
  couponId: string;
  code: string;
  endDate: Date | null;
  products: string[];
  startDate: Date;
  type: string;
  users: string[];
  value: number;
}
