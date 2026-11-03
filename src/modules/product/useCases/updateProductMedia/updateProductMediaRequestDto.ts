export interface UpdateProductMediaRequestDto {
  productId: string;
  videos: string[];
  allImages: string[];
  images: string[];
  coverFile?: {
    originalname: string;
    mimetype: 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp';
    size: number;
    buffer: Buffer;
  };
  allImageFiles?: {
    originalname: string;
    mimetype: 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp';
    size: number;
    buffer: Buffer;
  }[];
}
