export interface CreatePublisherRequestDto {
  name: string;
  logoFile?: Express.Multer.File;
  slug?: string;
}
