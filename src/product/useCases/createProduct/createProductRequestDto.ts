export interface CreateProductRequestDto {
  title: string;
  minimumRequirements: string;
  recommendedRequirements: string;
  shouldPublish: boolean;
  markdown: string;
  price: number;
  genres: string[];
  selectedImages: {
    originalname: string;
    mimetype: 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp';
    size: number;
    buffer: Buffer;
  }[];
  videos: string[];
  developers: string[];
  features: string[];
  releaseDate: Date;
  publisher: string;
  platform: string;
  link?: string;
  os: string;
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
  imageFiles: {
    originalname: string;
    mimetype: 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp';
    size: number;
    buffer: Buffer;
  }[];
  keysFile: {
    originalname: string;
    mimetype: 'text/plain';
    size: number;
    buffer: Buffer;
  };
}
