import { ErrorCode } from "./ErrorCode";
import { ServerError } from "./ServerError";
import { HttpStatusCode } from "./HttpStatusCode";

export class TimeoutError extends ServerError {
  constructor(
    message: string = "Operation failed to complete within the required period of time"
  ) {
    super(message, ErrorCode.TIMEOUT, HttpStatusCode.INTERNAL_SERVER_ERROR_500);
  }
}
