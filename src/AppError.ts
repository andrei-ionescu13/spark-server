import { Result } from './Result';
import { UseCaseError } from './UseCaseError';

export namespace AppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public constructor(err?: any) {
      super(false, {
        message: `An unexpected error occurred.`,
        error: err,
      } as UseCaseError);
      console.log(`[AppError]: An unexpected error occurred`);
      console.error(err);
    }

    public static create(err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }

  export class UserNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'User not found' } as UseCaseError);
    }
  }

  export class NotFound extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, { message } as UseCaseError);
    }
  }
}
