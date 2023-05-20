type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteReviewsBulkUseCase implements UseCase<DeleteReviewsBulkRequestDto, Response> {
  constructor(private reviewRepo: ReviewRepoI) {}

  execute = async (request: DeleteReviewsBulkRequestDto): Promise<Response> => {
    try {
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
