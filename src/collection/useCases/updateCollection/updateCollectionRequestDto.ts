export interface UpdateCollectionRequestDto {
  collectionId: string;
  products: string[];
  description: string;
  meta: {
    description: string;
    keywords: string[];
    title: string;
  };
  slug: string;
  title: string;
  coverFile?: {
    originalname: string;
    mimetype: 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp';
    size: number;
    buffer: Buffer;
  };
  startDate: Date;
  isDeal: boolean;
  endDate?: Date;
}
