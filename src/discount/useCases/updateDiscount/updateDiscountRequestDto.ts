export interface UpdateDiscountRequestDto {
  discountId: string;
  endDate?: Date;
  products: string[];
  startDate: Date;
  title: string;
  type: string;
  value: number;
}
