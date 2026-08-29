export interface UpdateProductMediaRequestDto {
  productId: string;
  videos: string[];
  images: string[];
  selectedImages: string[];
  coverFile?: Express.Multer.File;
  imageFiles?: Express.Multer.File[];
}
