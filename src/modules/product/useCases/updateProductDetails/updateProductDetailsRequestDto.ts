export interface UpdateProductDetailsRequestDto {
  productId: string;
  title: string;
  minimumRequirements: string;
  recommendedRequirements: string;
  markdown: string;
  price: number;
  genres: string[];
  developers: string[];
  features: string[];
  releaseDate: Date;
  publisher: string;
  platform: string;
  link?: string;
  os: string[];
  slug: string;
}
