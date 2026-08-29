export interface SearchOrdersRequestDto {
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: Array<'open' | 'archived' | 'canceled'>;
  page?: number;
  limit?: number;
  paymentStatus?: Array<'authorized' | 'paid' | 'pending' | 'refunded' | 'expired'>;
  fulfillmentStatus?: Array<'fulfilled' | 'unfulfilled' | 'partially fulfilled'>;
}
