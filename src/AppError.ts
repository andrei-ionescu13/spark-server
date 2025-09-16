import { UseCaseError } from './UseCaseError';

export namespace UseCaseErrors {
  export class UnexpectedError extends UseCaseError {
    public constructor(error?) {
      super(error || 'An unexpected error occurred');
    }
  }

  export class NotFound extends UseCaseError {
    constructor(message: string) {
      super(message);
    }
  }

  export class DomainValidation extends UseCaseError {
    constructor(message: string) {
      super(message);
    }
  }

  export class ValidationError extends Error {
    constructor(public readonly message: string) {
      super(message);
    }
  }
}
