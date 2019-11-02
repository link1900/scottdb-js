import { ErrorCode } from './ErrorCode';
import { ServerError } from './ServerError';
import { HttpStatusCode } from './HttpStatusCode';

export class ForbiddenError extends ServerError {
  constructor(message: string) {
    super(message, ErrorCode.FORBIDDEN_ERROR, HttpStatusCode.FORBIDDEN_403);
  }
}
