export interface UpdatePlatformRequestDto {
  name: string;
  url: string;
  platformId: string;
  logoFile?: {
    originalname: string;
    mimetype: 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp' | 'image/svg+xml';
    size: number;
    buffer: Buffer;
  };
}
