export interface UpdateDiscountRequestDto {
  discountId: string;
  endDate: Date | null;
  product: string;
  startDate: Date;
  title: string;
  type: 'amount' | 'percentage';
  value: number;
}
