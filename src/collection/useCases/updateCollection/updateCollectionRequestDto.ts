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
  coverFile?: Express.Multer.File;
  startDate: Date;
  isDeal: boolean;
  endDate?: Date;
}
