export interface KeyDoc {
  product: string;
  createdAt: Date;
  updatedAt: Date | null;
  value: string;
  availability: 'available' | 'unavailable';
  status: 'secret' | 'revealed' | 'reported';
  _id: string;
}
