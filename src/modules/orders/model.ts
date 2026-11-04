import { CouponDoc } from '../coupon/model';
import { DiscountDoc } from '../discount/model';
import { KeyDoc } from '../key/model';
import { Product } from '../product/domain/product';
import { ProductDoc } from '../product/model';

type Status = 'open' | 'archived' | 'canceled';
type PaymentStatus = 'authorized' | 'paid' | 'pending' | 'refunded' | 'expired';
type FulfillmentStatus = 'fulfilled' | 'unfulfilled' | 'partially fulfilled';

export interface OrderDoc {
  _id: string;
  status: Status;
  orderNumber: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  user: string;
  createdAt: Date;
  itemCount: number;
  totalPrice: number;
  totalDiscount: number;
  lineItems: OrderLineItemDoc[];
  updatedAt: Date | null;
  currency: string;
  stripeId: string;
}

export interface OrderLineItemDoc {
  _id: string;
  product: string;
  finalLinePrice: number;
  finalPrice: number;
  originalPrice: number;
  originalLinePrice: number;
  quantity: number;
  discount: string | null;
  coupon: string | null;
  keys: string[];
}

export interface OrderLineItemPopulateDoc
  extends Omit<OrderLineItemDoc, 'product' | 'discount' | 'coupon' | 'keys'> {
  product: ProductDoc;
  discount: DiscountDoc | null;
  coupon: CouponDoc | null;
  keys: KeyDoc[];
}
