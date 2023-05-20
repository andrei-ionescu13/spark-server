export interface CreateCouponRequestDto {
  code: string;
  endDate?: Date;
  productSelection: string;
  products?: string[];
  startDate: Date;
  type: string;
  userSelection: string;
  users: string[];
  value: string;
}
