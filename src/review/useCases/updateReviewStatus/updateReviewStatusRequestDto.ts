export interface UpdateReviewStatusRequestDto {
  reviewId: string;
  status: 'published' | 'unpublished' | 'flagged';
}
