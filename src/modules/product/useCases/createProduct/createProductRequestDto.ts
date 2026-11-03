export interface CreateProductRequestDto {
  title: string;
  minimumRequirements: string;
  recommendedRequirements: string;
  markdown: string;
  price: number;
  genres: string[];
  images: string[];
  videos: string[];
  developers: string[];
  features: string[];
  releaseDate: Date;
  publisher: string;
  platform: string;
  link?: string;
  os: string[];
  slug?: string;
  meta: {
    description: string;
    title: string;
    keywords: string[];
  };
  coverFile: {
    originalname: string;
    mimetype: 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp';
    size: number;
    buffer: Buffer;
  };
  allImageFiles: {
    originalname: string;
    mimetype: 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp';
    size: number;
    buffer: Buffer;
  }[];
}
