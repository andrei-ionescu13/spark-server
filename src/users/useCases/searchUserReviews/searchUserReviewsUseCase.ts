import { query } from 'express';
import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UserRepoI } from '../../userRepo';
import { SearchUserReviewsRequestDto } from './searchUserReviewsRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchUserReviewsUseCase implements UseCase<SearchUserReviewsRequestDto, Response> {
  constructor(private userRepo: UserRepoI) {}

  execute = async (request: SearchUserReviewsRequestDto): Promise<Response> => {
    const { userId, ...rest } = request;
    const query = rest;

    try {
      const reviews = await this.userRepo.searchUserReviews(userId, query);
      const count = await this.userRepo.getUserReviewsCount(userId, query);
      console.log(reviews);
      return right(Result.ok<any>({ reviews, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
