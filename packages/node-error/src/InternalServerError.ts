import { ErrorCode } from "./ErrorCode";
import { ServerError } from "./ServerError";
import { HttpStatusCode } from "./HttpStatusCode";

export class InternalServerError extends ServerError {
  constructor(message: string) {
    super(
      message,
      ErrorCode.INTERNAL_SERVER_ERROR,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }
}
