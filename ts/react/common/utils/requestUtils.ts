/*
Referencing Roblox.AccountSecurity.WebApp/ts/common/request/common.ts
*/
// TODO: put this in a shared lib.
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
 * Gets a single error code based on a JS object thrown by Axios.
 */
const parseErrorCode = (error: unknown): number | null => {
  const errorCodes = getApiErrorCodes(error);
  if (typeof error === "object") {
    // Sometimes the response returned by Axios hides the errors in `error.data`.
    getApiErrorCodes((error as Record<string, unknown>).data).forEach((item) =>
      errorCodes.push(item)
    );
  }

  return errorCodes[0] || null;
};

export default parseErrorCode;
