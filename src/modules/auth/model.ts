export interface AdminDoc {
  username: string;
  _id: string;
  passwordHash: string;
}

export interface TokenDoc {
  _id: string;
  admin: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  type: 'refresh-token';
}
