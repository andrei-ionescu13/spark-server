export interface CreateArticleRequestDto {
  description: string;
  meta: {
    description: string;
    keywords: string[];
    title: string;
  };
  shouldPublish: boolean;
  category: string;
  slug: string;
  title: string;
  markdown: string;
  coverFile: Express.Multer.File;
}
