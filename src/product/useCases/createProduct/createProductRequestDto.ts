export interface CreateProductRequestDto {
  title: any;
  minimumRequirements: any;
  recommendedRequirements: any;
  shouldPublish: any;
  markdown: any;
  price: any;
  initialPrice: any;
  genres: any;
  selectedImages: any;
  videos: any;
  developers: any;
  features: any;
  languages: any;
  releaseDate: any;
  publisher: any;
  platform: any;
  link: any;
  os: any;
  slug: any;
  metaTitle: any;
  metaDescription: any;
  metaKeywords: any;
  coverFile: Express.Multer.File;
  imageFiles: Express.Multer.File[];
  keysFile: Express.Multer.File;
}
