export interface UpdatePublisherRequestDto {
  name: string;
  publisherId: string;
  logoFile?: Express.Multer.File;
}
