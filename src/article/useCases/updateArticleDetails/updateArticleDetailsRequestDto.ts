export interface UpdateArticleDetailsRequestDto {
  description: string;
  title: string;
  markdown: string;
  cover?: string;
  file?: Record<string, any>;
  slug: string;
  articleId: string;
}
