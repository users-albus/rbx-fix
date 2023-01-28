import { AxiosPromise } from "axios";
import { Result } from "../result";

/**
 * Parses a JavaScript object, which can take on any type, into an array of
 * error codes based on the typical schema returned by our back-end.
 */
const getApiErrorCodes = (error: unknown): number[] => {
  const errorCodes: number[] = [];
  if (!error || typeof error !== "object") {
    return [];
  }

  const { errors } = error as Record<string, unknown>;
  if (!(errors instanceof Array)) {
    return [];
  }

  errors.forEach((errorObject: unknown) => {
    if (!errorObject || typeof errorObject !== "object") {
      return;
    }

    const { code } = errorObject as Record<string, unknown>;
    if (typeof code === "number") {
      errorCodes.push(code);
    }
  });

  return errorCodes;
};

/**
 * Gets a single error code based on a JS object thrown by Axios and intercepted
 * by our custom Roblox middleware.
 *
 * The expected format is either `undefined` or an object containing a `data`
 * field with one or more JSON errors from our back-end.
 *
 * More details in `js/core/http/implementations/httpClient.ts` within the
 * `Roblox.CoreScripts.WebApp`.
 */
const parseErrorCode = (error: unknown): number | null => {
  if (typeof error !== "object") {
    return null;
  }

  return getApiErrorCodes((error as Record<string, unknown>).data)[0] || null;
};

/**
 * Converts an unknown value into an enum type.
 */
export const toEnum = <T>(enumType: T, value: unknown): T[keyof T] | null => {
  if (enumType == null) {
    return null;
  }

  if (Object.values(enumType).includes(value)) {
    return value as T[keyof T];
  }

  return null;
};

/**
 * Converts an Axios HTTP request into a `Result`.
 */
export const toResult = async <T, M>(
  request: AxiosPromise<T>,
  errorEnum: M
): Promise<Result<T, M[keyof M] | null>> => {
  try {
    const response = await request;
    return Result.ok(response.data);
  } catch (error) {
    const errorCode = parseErrorCode(error);
    return Result.error(toEnum(errorEnum, errorCode));
  }
};
