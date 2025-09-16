export class Result<T, U extends Error> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error?: U;
  public _value?: T;

  private constructor(isSuccess: boolean, error?: U, value?: T) {
    if (isSuccess && error) {
      throw new Error(`InvalidOperation: A result cannot be 
        successful and contain an error`);
    }
    if (!isSuccess && !error) {
      throw new Error(`InvalidOperation: A failing result 
        needs to contain an error message`);
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public isOk(): this is { isSuccess: true; error: undefined; _value: T } {
    return this.isSuccess;
  }

  public isErr(): this is { isSuccess: false; error: U; _value: undefined } {
    return !this.isSuccess;
  }

  public static ok<T, U extends Error>(value?: T): Result<T, U> {
    return new Result<T, U>(true, undefined, value);
  }

  public static fail<T, U extends Error>(error: U): Result<T, U> {
    return new Result<T, U>(false, error);
  }

  // public static firstError<T, U extends Error>(results: Result<T, U>[]): Result<T, U> {
  //   const error = results.find((r) => r.isFailure);

  //   return error || Result.ok();
  // }

  public static combine<U extends Error>(results: Result<any, U>[]): Result<any, U> {
    for (let result of results) {
      if (result.isFailure) return result;
    }

    return Result.ok<any, any>();
  }

  public get value(): T {
    if (!this.isSuccess || !this._value) {
      throw new Error(`Can't retrieve the value from a failed result.`);
    }
    return this._value;
  }
}

// export type Either<L, A> = Left<L, A> | Right<L, A>;

// export class Left<L, A> {
//   readonly value: A | null = null;
//   readonly error: L;

//   constructor(error: L) {
//     this.error = error;
//   }

//   isLeft(): this is Left<L, A> {
//     return true;
//   }

//   isRight(): this is Right<L, A> {
//     return false;
//   }
// }

// export class Right<L, A> {
//   readonly value: A;
//   readonly error: null = null;

//   constructor(value: A) {
//     this.props.value = value;
//   }

//   isLeft(): this is Left<L, A> {
//     return false;
//   }

//   isRight(): this is Right<L, A> {
//     return true;
//   }
// }

// export const left = <L, A>(l: L): Left<L, A> => {
//   return new Left(l);
// };

// export const right = <L, A>(a: A): Right<L, A> => {
//   return new Right<L, A>(a);
// };

// export function firstLeft<L, A>(results: Either<L, A>[]): Left<L, A> | undefined {
//   return results.find((r): r is Left<L, A> => r.isLeft());
// }
