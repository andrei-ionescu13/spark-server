export interface CreateArticleRequestDto {
  tags: string[];
  description: string;
  meta: {
    description: string;
    title: string;
    keywords: string[];
  };
  title: string;
  shouldPublish: boolean;
  category: string;
  markdown: string;
  coverFile: {
    originalname: string;
    mimetype: 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp';
    size: number;
    buffer: Buffer;
  };
  slug?: string;
}
