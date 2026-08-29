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
  languages: string[];
  releaseDate: string;
  publisher: string;
  platform: string;
  link: string;
  os: string[];
  slug: string;
}
