export interface CreatePlatformRequestDto {
  name: string;
  logoFile: {
    originalname: string;
    mimetype: 'image/jpeg' | 'image/jpg' | 'image/png' | 'image/webp' | 'image/svg+xml';
    size: number;
    buffer: Buffer;
  };
  url: string;
}
