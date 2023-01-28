/**
 * A functional-programming-inspired type that holds either a success result or
 * an error message (e.g. from an HTTP request). This paradigm is useful
 * because errors that are thrown in JavaScript are necessarily untyped, so if
 * you're expecting a possible error, it is better to return a `Result` than to
 * throw.
 */
export type Result<T, E> =
  | {
      readonly isError: false;
      readonly value: T;
    }
  | {
      readonly isError: true;
      readonly error: E;
    };

const ok = <T, E>(value: T): Result<T, E> => ({
  isError: false,
  value,
});

const error = <T, E>(errorValue: E): Result<T, E> => ({
  isError: true,
  error: errorValue,
});

const map = <T, E, R>(
  result: Result<T, E>,
  mapper: (value: T) => R
): Result<R, E> => (result.isError ? result : ok(mapper(result.value)));

export const Result = { ok, error, map };
