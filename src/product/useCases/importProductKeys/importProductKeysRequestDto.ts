export interface ImportProductKeysRequestDto {
  keysFile: Express.Multer.File;
  productId: string;
}
