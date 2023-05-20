export interface UpdatePlatformRequestDto {
  platformId: string;
  name: string;
  logoFile: Express.Multer.File;
}
