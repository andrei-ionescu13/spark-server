export class ValidationError extends Error {
  status = 400;

  constructor(message) {
    super(message);
  }
}

export class NotFoundError extends Error {
  status = 404;

  constructor(message) {
    super(message);
  }
}

export class ForbiddenError extends Error {
  status = 403;

  constructor(message) {
    super(message);
  }
}
