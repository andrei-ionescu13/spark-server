export interface UpdatePublisherRequestDto {
  name: string;
  publisherId: string;
  logoFile?: {
    originalname: string;
    mimetype: 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp' | 'image/svg+xml';
    size: number;
    buffer: Buffer;
  };
}
