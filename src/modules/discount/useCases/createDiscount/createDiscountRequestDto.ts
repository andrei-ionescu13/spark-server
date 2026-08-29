export interface CreateDiscountRequestDto {
  endDate?: Date;
  products: string[];
  startDate: Date;
  title: string;
  type: string;
  value: number;
}
