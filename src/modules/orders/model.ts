type Status = 'open' | 'archived' | 'canceled';
type PaymentStatus = 'authorized' | 'paid' | 'pending' | 'refunded' | 'expired';
type FulfillmentStatus = 'fulfilled' | 'unfulfilled' | 'partially fulfilled';

export interface OrderDoc {
  _id: string;
  status: Status;
  orderNumber: string;
  email: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  customer: string;
  createdAt: Date;
  itemCount: number;
  totalPrice: number;
  totalDiscounts: number;
  lineItems: LineItemDoc[];
}

export interface LineItemDoc {
  _id: string;
  product: string;
  finalLinePrice: number;
  finalPrice: number;
  originalPrice: number;
  originalLinePrice: number;
  quantity: number;
}
