export interface UpdateArticleDetailsRequestDto {
  articleId: string;
  description: string;
  title: string;
  markdown: string;
  slug: string;
  file?: {
    originalname: string;
    mimetype: 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp';
    size: number;
    buffer: Buffer;
  };
  cover?: string;
}
