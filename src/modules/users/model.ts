export interface UserDoc {
  email: string;
  password: string;
  createdAt: Date;
  status: 'active' | 'inactive' | 'banned';
  updatedAt: Date;
  orders: string[];
  activeOrders: string[];
  ordersCount: number;
  totalSpend: number;
  reviews: string[];
  coupons: string[];
  _id: string;
}
