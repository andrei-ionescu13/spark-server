export interface SearchOrdersRequestDto {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string[];
  page?: number;
  limit?: number;
  paymentStatus?: string[];
  fulfillmentStatus?: string[];
}
