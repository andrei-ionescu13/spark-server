export interface UpdateDealRequestDto {
  dealId: string;
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
  endDate?: Date;
}
