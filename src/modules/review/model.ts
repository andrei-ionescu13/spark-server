type Status = 'published' | 'unpublished' | 'flagged';

export interface ReviewDoc {
  userName: string;
  user: string;
  product: string;
  rating: number;
  content: string;
  createdAt: Date;
  status: Status;
  _id: string;
}
