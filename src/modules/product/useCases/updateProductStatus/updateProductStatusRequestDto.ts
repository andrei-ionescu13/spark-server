export interface UpdateProductStatusRequestDto {
  productId: string;
  status: 'draft' | 'published' | 'archived';
}
