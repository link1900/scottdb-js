import { ErrorCode } from "./ErrorCode";
import { ServerError } from "./ServerError";
import { HttpStatusCode } from "./HttpStatusCode";

export class UnauthorizedError extends ServerError {
  constructor(message: string) {
    super(
      message,
      ErrorCode.UNAUTHORIZED_ERROR,
      HttpStatusCode.UNAUTHORIZED_401
    );
  }
}
