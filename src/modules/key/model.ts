export interface KeyDoc {
  product: string;
  createdAt: Date;
  value: string;
  availability: 'available' | 'unavailable';
  status: 'secret' | 'revealed' | 'reported';
  _id: string;
}
