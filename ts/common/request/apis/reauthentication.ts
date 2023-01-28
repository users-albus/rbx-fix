import { httpService } from "core-utilities";
import { Result } from "../../result";
import { toResult } from "../common";
import * as Reauthentication from "../types/reauthentication";

// eslint-disable-next-line import/prefer-default-export
export const generateToken = (
  password: string
): Promise<
  Result<
    Reauthentication.GenerateTokenReturnType,
    Reauthentication.ReauthenticationError | null
  >
> =>
  toResult(
    httpService.post(Reauthentication.GENERATE_TOKEN_CONFIG, {
      password,
    }),
    Reauthentication.ReauthenticationError
  );
