export class Result<T, U extends Error> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;

  public readonly error: U | undefined;
  public readonly _value: T | undefined;

  private constructor(isSuccess: boolean, error?: U, value?: T) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error');
    }

    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: A failing result needs to contain an error');
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public isOk(): this is Result<T, never> {
    return this.isSuccess;
  }

  public isErr(): this is Result<never, U> {
    return this.isFailure;
  }

  public static ok<T, U extends Error>(value?: T): Result<T, U> {
    return new Result<T, U>(true, undefined, value);
  }

  public static fail<T, U extends Error>(error: U): Result<T, U> {
    return new Result<T, U>(false, error);
  }

  public static combine<T extends unknown[], U extends Error>(results: {
    [K in keyof T]: Result<T[K], U>;
  }): Result<T, U> {
    for (const result of results) {
      if (result.isErr()) {
        return Result.fail(result.error);
      }
    }

    return Result.ok(results.map((result) => result.value) as unknown as T);
  }

  public get value(): T {
    if (!this.isSuccess) {
      throw new Error("Can't retrieve the value from a failed result.");
    }

    return this._value;
  }

  public static getValues<T, U extends Error>(results: Result<T, U>[]): T[] {
    return results.map((result) => result.value);
  }
}
