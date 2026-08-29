export interface UpdateArticleStatusRequestDto {
  articleId: string;
  status: 'draft' | 'published' | 'archived';
}
